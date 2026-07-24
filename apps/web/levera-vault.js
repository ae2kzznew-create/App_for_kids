// ---------- Vault adapters ----------
let vault = null; // { label, list():Promise<string[]>, read(name), write(name, content), remove(name) }

function demoVault(){
  const files = new Map();
  const now = new Date().toISOString();
  const put = (type, managed, preserved, heading, body) => {
    const name = entityFileName(type, managed.levera_id, heading.startsWith("Weekly") ? managed.week_start : heading);
    files.set(name, buildMarkdown(type, managed, preserved, heading, body));
  };
  put("goal", { levera_id: "goal_demo_guitar", levera_type: "goal", profile_id: "pavel", status: "active", updated: now }, {}, "Играть на гитаре", "Свободно аккомпанировать себе к концу года.");
  put("skill", { levera_id: "skill_demo_chords", levera_type: "skill", goal_id: "goal_demo_guitar", status: "stable", support_level: 1, mastery_score: 55, updated: now }, {}, "Открытые аккорды", "Am, Em, C, G, D без пауз.");
  put("skill", { levera_id: "skill_demo_rhythm", levera_type: "skill", goal_id: "goal_demo_guitar", status: "due", support_level: 2, mastery_score: 30, next_review_at: now, updated: now }, {}, "Ритм и бой", "Шестёрка и восьмёрка под метроном.");
  put("quest", { levera_id: "quest_demo_song", levera_type: "quest", skill_ids: ["skill_demo_chords"], status: "active", support_level: 1, xp_reward: 40, maintenance: false, updated: now }, {}, "Сыграть «Кино» целиком", "Без остановок, в темпе 90.");
  put("quest", { levera_id: "quest_demo_metronome", levera_type: "quest", skill_ids: ["skill_demo_rhythm"], status: "active", support_level: 2, xp_reward: 25, maintenance: false, updated: now }, {}, "15 минут с метрономом", "");
  put("quest", { levera_id: "quest_demo_done", levera_type: "quest", skill_ids: ["skill_demo_chords"], status: "completed", support_level: 1, xp_reward: 30, maintenance: false, updated: now }, {}, "Переходы Am→G без паузы", "");
  put("weekly_review", { levera_id: "review_demo_1", levera_type: "weekly_review", profile_id: "pavel", week_start: mondayOf(new Date()), completed_at: now }, {}, "Weekly review · " + mondayOf(new Date()), reviewBody("Каждый день брал гитару в руки.", "Пальцы устают на баррэ.", "На следующей неделе — по 10 минут ритма ежедневно."));
  files.set("моя-заметка.md", "# Обычная заметка Obsidian\n\nЕё Levera не трогает.");
  return {
    label: "Демо-данные (не сохраняются)",
    demo: true,
    list: async () => [...files.keys()],
    read: async (name) => files.get(name),
    write: async (name, content) => { files.set(name, content); },
    remove: async (name) => { files.delete(name); },
  };
}

const MAX_TREE_DEPTH = 4;

function fsVault(handle){
  async function walk(dirHandle, prefix, names, depth){
    for await (const entry of dirHandle.values()) {
      if (entry.name.startsWith(".")) continue;
      if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".md")) names.push(prefix + entry.name);
      else if (entry.kind === "directory" && depth < MAX_TREE_DEPTH) await walk(entry, prefix + entry.name + "/", names, depth + 1);
    }
  }
  async function dirFor(name, create){
    const parts = String(name).split("/").filter(Boolean);
    const base = parts.pop();
    let dir = handle;
    for (const part of parts) dir = await dir.getDirectoryHandle(part, { create });
    return { dir, base };
  }
  return {
    label: "Папка: " + handle.name,
    demo: false,
    list: async () => { const names = []; await walk(handle, "", names, 0); return names; },
    read: async (name) => { const { dir, base } = await dirFor(name, false); const file = await (await dir.getFileHandle(base)).getFile(); return file.text(); },
    write: async (name, content) => {
      const { dir, base } = await dirFor(name, true);
      const fileHandle = await dir.getFileHandle(base, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
    },
    remove: async (name) => { const { dir, base } = await dirFor(name, false); await dir.removeEntry(base); },
  };
}

function desktopVault(folderPath){
  const bridge = window.leveraVault;
  return {
    label: "Папка: " + folderPath,
    demo: false,
    list: () => bridge.list(),
    read: (name) => bridge.read(name),
    write: (name, content) => bridge.write(name, content),
    remove: (name) => bridge.remove(name),
  };
}

// remember the folder between sessions
const DB_NAME = "levera-web";
function idb(){ return new Promise((resolve, reject) => { const request = indexedDB.open(DB_NAME, 1); request.onupgradeneeded = () => request.result.createObjectStore("kv"); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
async function kvSet(key, value){ const database = await idb(); return new Promise((resolve, reject) => { const tx = database.transaction("kv", "readwrite"); tx.objectStore("kv").put(value, key); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); }); }
async function kvGet(key){ const database = await idb(); return new Promise((resolve, reject) => { const tx = database.transaction("kv", "readonly"); const request = tx.objectStore("kv").get(key); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }

// ---------- State ----------
const state = { entities: new Map(), fileFor: new Map(), tab: "overview", errors: [] };
function byType(type){ return [...state.entities.values()].filter((entity) => entity.type === type); }
function get(type, id){ return state.entities.get(type + ":" + id); }

async function loadVault(){
  state.entities.clear(); state.fileFor.clear(); state.errors = [];
  const names = await vault.list();
  for (const name of names.sort()) {
    let content;
    try { content = await vault.read(name); } catch { continue; }
    if (!isLeveraDocument(content)) continue;
    try {
      const parsed = parseDocument(content);
      const key = parsed.type + ":" + parsed.id;
      if (state.entities.has(key)) { state.errors.push("Дубль " + key + " в файле " + name + " — файл пропущен"); continue; }
      state.entities.set(key, parsed);
      state.fileFor.set(key, name);
    } catch (error) {
      state.errors.push(name + ": " + (error && error.message ? error.message : "не удалось разобрать"));
    }
  }
  if (!vault.demo) await migrateLegacyFiles();
  render();
}

// Раскладывает старые плоские файлы (goals__… в корне) в дерево Levera/.
// Файлы, которые уже лежат в какой-либо подпапке, не трогаем.
async function migrateLegacyFiles(){
  let moved = 0;
  for (const [key, name] of [...state.fileFor.entries()]) {
    if (name.includes("/")) continue;
    const entity = state.entities.get(key);
    try {
      await saveEntity(entity, entity.title, descriptionBody(entity.body));
      if (state.fileFor.get(key) !== name) moved += 1;
    } catch {
      state.errors.push("Не удалось перенести " + name + " в дерево Levera/");
    }
  }
  if (moved) show("Файлы разложены в дерево Levera/ · перенесено: " + moved);
}

async function saveEntity(parsed, heading, body){
  const key = parsed.type + ":" + parsed.id;
  const managed = {}; for (const field of MANAGED[parsed.type]) managed[field] = parsed.fields[field];
  const markdown = buildMarkdown(parsed.type, managed, parsed.fields, heading, body);
  const title = parsed.type === "weekly_review" ? String(parsed.fields.week_start || "") : heading;
  const target = entityFileName(parsed.type, parsed.id, title);
  const previous = state.fileFor.get(key);
  await vault.write(target, markdown);
  if (previous && previous !== target) { try { await vault.remove(previous); } catch {} }
  state.fileFor.set(key, target);
  const reparsed = parseDocument(markdown);
  state.entities.set(key, reparsed);
}
