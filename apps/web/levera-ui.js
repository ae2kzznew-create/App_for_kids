// ---------- UI ----------
const el = (id) => document.getElementById(id);
function show(message){ const node = el("msg"); node.textContent = message; node.classList.add("show"); setTimeout(() => node.classList.remove("show"), 2600); }
function esc(value){ return String(value).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

const SKILL_STATUS = { growing: ["Растёт", "green"], stable: ["Стабильный", "blue"], due: ["Пора повторить", "orange"], fading: ["Затухает", "red"], paused: ["На паузе", "gray"] };
const QUEST_STATUS = { planned: ["Запланирован", "gray"], active: ["В работе", "blue"], completed: ["Выполнен", "green"], archived: ["В архиве", "gray"] };
const GOAL_STATUS = { active: ["Активна", "blue"], completed: ["Достигнута", "green"], archived: ["В архиве", "gray"] };
function badge(map, status){ const [label, color] = map[status] || [status, "gray"]; return '<span class="badge ' + color + '">' + esc(label) + "</span>"; }
function skillLiveStatus(skill){
  const status = skill.fields.status;
  const next = skill.fields.next_review_at;
  if ((status === "growing" || status === "stable" || status === "due" || status === "fading") && typeof next === "string" && next && new Date(next) <= new Date()) return status === "fading" ? "fading" : "due";
  return status;
}
function barColor(status){ return status === "due" ? "orange" : status === "fading" ? "red" : status === "paused" ? "gray" : status === "stable" ? "blue" : ""; }

const TABS = [["overview", "Обзор", "☀️"], ["goals", "Цели", "🎯"], ["skills", "Навыки", "🌱"], ["quests", "Квесты", "⚔️"], ["reviews", "Обзоры недели", "🗓️"]];
function render(){
  el("connect").hidden = true; el("app").hidden = false; el("btnReload").hidden = false;
  const chip = el("vaultChip"); chip.textContent = vault.label; chip.classList.add("ok"); chip.title = vault.label;
  el("tabs").innerHTML = TABS.map(([id, label, icon]) => '<button data-tab="' + id + '" class="' + (state.tab === id ? "active" : "") + '"><span class="tic" aria-hidden="true">' + icon + "</span>" + label + "</button>").join("");
  for (const button of el("tabs").querySelectorAll("button")) button.onclick = () => { state.tab = button.dataset.tab; render(); };
  const views = { overview: renderOverview, goals: renderGoals, skills: renderSkills, quests: renderQuests, reviews: renderReviews };
  el("view").innerHTML = (state.errors.length ? '<div class="callout" style="border-color:var(--red);background:var(--red-soft)"><div class="ct">⚠️ Часть файлов пропущена</div><div style="font-size:13px;white-space:pre-wrap">' + state.errors.map(esc).join("\n") + "</div></div>" : "") + views[state.tab]();
  bindActions();
}

function questXp(quest){ return Number(quest.fields.xp_reward) || 0; }
function todayLabel(){
  const label = new Intl.DateTimeFormat("ru-RU", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}
function renderOverview(){
  const goals = byType("goal").filter((goal) => goal.fields.status === "active");
  const skills = byType("skill");
  const quests = byType("quest");
  const active = quests.filter((quest) => quest.fields.status === "active" || quest.fields.status === "planned");
  const attention = skills.filter((skill) => ["due", "fading"].includes(skillLiveStatus(skill)));
  const stats = [
    ["🎯", "soft-blue", goals.length, "активные цели"],
    ["🌱", "soft-green", skills.filter((skill) => skill.fields.status !== "paused").length + " / " + skills.length, "навыков в развитии"],
    ["⚔️", "soft-blue", active.length, "квестов в работе · " + active.reduce((sum, quest) => sum + questXp(quest), 0) + " XP"],
    ["⏰", attention.length ? "soft-orange" : "soft-gray", attention.length, "требуют повторения"],
  ];
  return '<div class="hero"><div class="date">' + esc(todayLabel()) + '</div><h2>Сегодня</h2></div>' +
    '<div class="grid stats">' + stats.map(([icon, tone, big, label]) => '<div class="stat"><div class="sic ' + tone + '" aria-hidden="true">' + icon + '</div><div><div class="big">' + big + '</div><div class="lbl">' + label + "</div></div></div>").join("") + "</div>" +
    (attention.length ? '<div class="section-head"><h2>Пора повторить</h2><span class="count">' + attention.length + '</span></div><div class="callout"><div class="ct">⏰ Эти навыки давно не повторялись</div>' + attention.map(skillItem).join("") + "</div>" : "") +
    '<div class="section-head"><h2>Квесты в работе</h2><span class="count">' + active.length + "</span></div>" +
    (active.length ? active.map(questItem).join("") : emptyState("🌞", "На сегодня активных квестов нет", "Создай новый на вкладке «Квесты»."));
}
function emptyState(icon, title, hint){
  return '<div class="empty"><span class="eic" aria-hidden="true">' + icon + "</span><b>" + title + "</b><br><span style=\"font-size:13px\">" + hint + "</span></div>";
}
function questItem(quest){
  const done = quest.fields.status === "completed";
  const skills = (Array.isArray(quest.fields.skill_ids) ? quest.fields.skill_ids : []).map((id) => (get("skill", id) || { title: id }).title).join(", ");
  const xp = quest.fields.maintenance === true || questXp(quest) === 0 ? '<span class="badge gray">поддержание · 0 XP</span>' : '<span class="badge ' + (done ? "green" : "blue") + '">✦ ' + questXp(quest) + " XP</span>";
  const edit = '<button class="small" data-action="edit-quest" data-id="' + esc(quest.id) + '" title="Изменить" aria-label="Изменить квест">✎</button>';
  const actions = edit + (quest.fields.status === "active" || quest.fields.status === "planned"
    ? '<button class="small primary" data-action="complete" data-id="' + esc(quest.id) + '">Выполнить</button>'
    : (done ? '<button class="small" data-action="reopen" data-id="' + esc(quest.id) + '">Вернуть</button>' : ""));
  return '<div class="item"><div class="iic ' + (done ? "soft-green" : "soft-blue") + '" aria-hidden="true">' + (done ? "✅" : "⚔️") + '</div><div class="body"><div class="title' + (done ? " done" : "") + '">' + esc(quest.title) + '</div><div class="meta">' + badge(QUEST_STATUS, quest.fields.status) + " " + xp + '<span>L' + esc(quest.fields.support_level) + '</span><span>·</span><span>' + esc(skills || "—") + "</span></div>" + (descriptionBody(quest.body) ? '<div class="desc">' + esc(descriptionBody(quest.body)) + "</div>" : "") + '</div><div class="side">' + actions + "</div></div>";
}
function skillItem(skill){
  const goal = get("goal", skill.fields.goal_id);
  const status = skillLiveStatus(skill);
  const mastery = Number(skill.fields.mastery_score) || 0;
  return '<div class="item"><div class="iic soft-green" aria-hidden="true">🌱</div><div class="body"><div class="title">' + esc(skill.title) + '</div><div class="meta">' + badge(SKILL_STATUS, status) + '<span class="row" style="gap:8px;flex:1;min-width:140px;max-width:240px"><span class="bar"><i class="' + barColor(status) + '" style="width:' + mastery + '%"></i></span><span>' + mastery + "/100</span></span><span>L" + esc(skill.fields.support_level) + "</span>" + (goal ? "<span>·</span><span>" + esc(goal.title) + "</span>" : "") + '</div></div><div class="side"><button class="small" data-action="edit-skill" data-id="' + esc(skill.id) + '" title="Изменить" aria-label="Изменить навык">✎</button></div></div>';
}
function renderGoals(){
  const goals = byType("goal");
  const blocks = goals.map((goal) => {
    const skills = byType("skill").filter((skill) => skill.fields.goal_id === goal.id);
    const skillIds = new Set(skills.map((skill) => skill.id));
    const quests = byType("quest").filter((quest) => (quest.fields.skill_ids || []).some((id) => skillIds.has(id)));
    const doneCount = quests.filter((quest) => quest.fields.status === "completed").length;
    const percent = quests.length ? Math.round(doneCount / quests.length * 100) : 0;
    return '<div class="goal-block"><div class="head"><div class="gic soft-blue" aria-hidden="true">🎯</div><span class="title">' + esc(goal.title) + "</span>" + badge(GOAL_STATUS, goal.fields.status) + '<button class="small" data-action="edit-goal" data-id="' + esc(goal.id) + '" title="Изменить" aria-label="Изменить цель">✎</button><button class="small" data-action="add-skill" data-id="' + esc(goal.id) + '">+ Навык</button></div>' +
      (descriptionBody(goal.body) ? '<div class="gdesc">' + esc(descriptionBody(goal.body)) + "</div>" : "") +
      (quests.length ? '<div class="gprogress"><span class="bar"><i style="width:' + percent + '%"></i></span><span>' + doneCount + " из " + quests.length + " квестов выполнено</span></div>" : "") +
      '<div class="subsection">НАВЫКИ · ' + skills.length + "</div>" + (skills.length ? skills.map(skillItem).join("") : emptyState("🌱", "Пока нет навыков", "Добавь первый кнопкой «+ Навык».")) +
      '<div class="subsection">КВЕСТЫ · ' + quests.length + "</div>" + (quests.length ? quests.map(questItem).join("") : emptyState("⚔️", "Пока нет квестов", "Создай первый на вкладке «Квесты».")) + "</div>";
  }).join("");
  return '<div class="section-head"><h2>Цели</h2><span class="count">' + goals.length + '</span><span class="spacer"></span><button class="ghost" data-action="ai-plan">✨ План с ИИ</button><button class="primary" data-action="add-goal">+ Новая цель</button></div>' + (blocks || emptyState("🎯", "Целей пока нет", "Начни с первой — кнопка «+ Новая цель» сверху, или попроси ИИ собрать план."));
}
function renderSkills(){
  const skills = byType("skill");
  const rows = skills.map((skill) => {
    const goal = get("goal", skill.fields.goal_id);
    const status = skillLiveStatus(skill);
    const mastery = Number(skill.fields.mastery_score) || 0;
    return "<tr><td><strong>" + esc(skill.title) + "</strong></td><td>" + badge(SKILL_STATUS, status) + '</td><td><div class="row" style="flex-wrap:nowrap"><div class="bar"><i class="' + barColor(status) + '" style="width:' + mastery + '%"></i></div><span style="font-size:13px;color:var(--muted)">' + mastery + "</span></div></td><td>L" + esc(skill.fields.support_level) + "</td><td>" + esc(goal ? goal.title : "—") + "</td></tr>";
  }).join("");
  return '<div class="section-head"><h2>Навыки</h2><span class="count">' + skills.length + "</span></div>" + (skills.length ? '<div class="table-wrap"><table class="skill-table"><thead><tr><th>Навык</th><th>Статус</th><th>Мастерство</th><th>Поддержка</th><th>Цель</th></tr></thead><tbody>' + rows + "</tbody></table></div>" : emptyState("🌱", "Навыков пока нет", "Добавь навык к цели на вкладке «Цели»."));
}
function renderQuests(){
  const quests = byType("quest");
  const open = quests.filter((quest) => quest.fields.status === "active" || quest.fields.status === "planned");
  const done = quests.filter((quest) => quest.fields.status === "completed");
  return '<div class="section-head"><h2>Квесты</h2><span class="count">' + open.length + '</span><span class="spacer"></span><button class="primary" data-action="add-quest">+ Новый квест</button></div>' +
    (open.length ? open.map(questItem).join("") : emptyState("⚔️", "Активных квестов нет", "Самое время взять новый вызов.")) +
    (done.length ? '<div class="section-head"><h2>Выполненные</h2><span class="count">' + done.length + "</span></div>" + done.map(questItem).join("") : "");
}
function renderReviews(){
  const reviews = byType("weekly_review").sort((left, right) => String(right.fields.week_start).localeCompare(String(left.fields.week_start)));
  const items = reviews.map((review, index) => '<div class="review"><div class="rhead"><div class="ric soft-blue" aria-hidden="true">🗓️</div><b>Неделя с ' + esc(review.fields.week_start) + "</b>" + (index === 0 ? '<span class="badge green fresh">последний</span>' : "") + "</div>" +
    (section(review.body, "Achievements") ? "<p><b>Получилось · </b>" + esc(section(review.body, "Achievements")) + "</p>" : "") +
    (section(review.body, "Blockers") ? "<p><b>Мешало · </b>" + esc(section(review.body, "Blockers")) + "</p>" : "") +
    "<p><b>Решение · </b>" + esc(section(review.body, "Decision")) + "</p></div>").join("");
  return '<div class="section-head"><h2>Обзоры недели</h2><span class="count">' + reviews.length + '</span><span class="spacer"></span><button class="primary" data-action="add-review">+ Обзор недели</button></div>' + (items || emptyState("🗓️", "Обзоров пока нет", "Первый можно сделать прямо сейчас — это 3 минуты."));
}

// ---------- Dialogs & actions ----------
function openDialog(html, onSubmit){
  const dialog = el("dialog");
  dialog.innerHTML = html + '<div class="dialog-actions"><button data-close>Отмена</button><button class="primary" data-ok>Сохранить</button></div>';
  dialog.querySelector("[data-close]").onclick = () => dialog.close();
  dialog.querySelector("[data-ok]").onclick = async () => {
    try { if (await onSubmit(dialog) !== false) dialog.close(); }
    catch (error) { show(error && error.message ? error.message : "Не удалось сохранить"); }
  };
  dialog.showModal();
}
const now = () => new Date().toISOString();
function bindActions(){
  for (const button of el("view").querySelectorAll("[data-action]")) {
    const id = button.dataset.id;
    button.onclick = () => ({
      "add-goal": dlgGoal, "add-skill": () => dlgSkill(id), "add-quest": dlgQuest, "add-review": dlgReview,
      "edit-goal": () => dlgEditGoal(id), "edit-skill": () => dlgEditSkill(id), "edit-quest": () => dlgEditQuest(id),
      "ai-plan": dlgAiPlan,
      complete: () => dlgComplete(id), reopen: () => reopenQuest(id),
    })[button.dataset.action]();
  }
}
function dlgGoal(){
  openDialog("<h3>🎯 Новая цель</h3><label>Название</label><input id=\"fTitle\" required><label>Описание (необязательно)</label><textarea id=\"fDesc\"></textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    const id = newId("goal");
    const parsed = { id, type: "goal", title, body: "", fields: { levera_id: id, levera_type: "goal", profile_id: "pavel", status: "active", updated: now() } };
    await saveEntity(parsed, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Цель создана");
  });
}
function dlgSkill(goalId){
  const goals = byType("goal").filter((goal) => goal.fields.status === "active");
  if (!goals.length) { show("Сначала создай цель"); return; }
  const options = goals.map((goal) => '<option value="' + esc(goal.id) + '"' + (goal.id === goalId ? " selected" : "") + ">" + esc(goal.title) + "</option>").join("");
  openDialog("<h3>🌱 Новый навык</h3><label>Название</label><input id=\"fTitle\"><label>Цель</label><select id=\"fGoal\">" + options + "</select><label>Уровень поддержки (L0 — сам, L3 — с опорой)</label><select id=\"fSupport\"><option value=\"3\">L3</option><option value=\"2\" selected>L2</option><option value=\"1\">L1</option><option value=\"0\">L0</option></select><label>Описание (необязательно)</label><textarea id=\"fDesc\"></textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    const id = newId("skill");
    const parsed = { id, type: "skill", title, body: "", fields: { levera_id: id, levera_type: "skill", goal_id: dialog.querySelector("#fGoal").value, status: "growing", support_level: Number(dialog.querySelector("#fSupport").value), mastery_score: 0, updated: now() } };
    await saveEntity(parsed, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Навык создан");
  });
}
function dlgQuest(){
  const skills = byType("skill");
  if (!skills.length) { show("Сначала создай навык"); return; }
  const options = skills.map((skill) => '<option value="' + esc(skill.id) + '">' + esc(skill.title) + "</option>").join("");
  openDialog("<h3>⚔️ Новый квест</h3><label>Название</label><input id=\"fTitle\"><label>Навыки (Ctrl/Cmd — несколько)</label><select id=\"fSkills\" multiple size=\"4\">" + options + "</select><label>XP (0 = поддержание без награды)</label><input id=\"fXp\" type=\"number\" min=\"0\" max=\"100000\" value=\"25\"><label>Уровень поддержки</label><select id=\"fSupport\"><option value=\"3\">L3</option><option value=\"2\" selected>L2</option><option value=\"1\">L1</option><option value=\"0\">L0</option></select><label>Описание (необязательно)</label><textarea id=\"fDesc\"></textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    const skillIds = [...dialog.querySelector("#fSkills").selectedOptions].map((option) => option.value);
    if (!skillIds.length) { show("Выбери хотя бы один навык"); return false; }
    const xp = Math.max(0, Math.floor(Number(dialog.querySelector("#fXp").value) || 0));
    const id = newId("quest");
    const parsed = { id, type: "quest", title, body: "", fields: { levera_id: id, levera_type: "quest", skill_ids: skillIds, status: "active", support_level: Number(dialog.querySelector("#fSupport").value), xp_reward: xp, maintenance: xp === 0, updated: now() } };
    await saveEntity(parsed, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Квест создан");
  });
}
function statusOptions(map, current){
  return Object.keys(map).map((key) => '<option value="' + key + '"' + (key === current ? " selected" : "") + '>' + map[key][0] + "</option>").join("");
}
function supportOptions(current){
  return [3, 2, 1, 0].map((level) => '<option value="' + level + '"' + (Number(current) === level ? " selected" : "") + '>L' + level + "</option>").join("");
}
function dlgEditGoal(id){
  const goal = get("goal", id); if (!goal) return;
  openDialog("<h3>✎ Изменить цель</h3><label>Название</label><input id=\"fTitle\" value=\"" + esc(goal.title) + "\"><label>Статус</label><select id=\"fStatus\">" + statusOptions(GOAL_STATUS, goal.fields.status) + "</select><label>Описание</label><textarea id=\"fDesc\">" + esc(descriptionBody(goal.body)) + "</textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    goal.fields.status = dialog.querySelector("#fStatus").value;
    goal.fields.updated = now();
    await saveEntity(goal, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Цель обновлена");
  });
}
function dlgEditSkill(id){
  const skill = get("skill", id); if (!skill) return;
  const options = byType("goal").map((goal) => '<option value="' + esc(goal.id) + '"' + (goal.id === skill.fields.goal_id ? " selected" : "") + '>' + esc(goal.title) + "</option>").join("");
  openDialog("<h3>✎ Изменить навык</h3><label>Название</label><input id=\"fTitle\" value=\"" + esc(skill.title) + "\"><label>Цель</label><select id=\"fGoal\">" + options + "</select><label>Статус (пауза — без чувства вины)</label><select id=\"fStatus\">" + statusOptions(SKILL_STATUS, skill.fields.status) + "</select><label>Мастерство 0–100 (меняй только по реальным доказательствам)</label><input id=\"fMastery\" type=\"number\" min=\"0\" max=\"100\" value=\"" + (Number(skill.fields.mastery_score) || 0) + "\"><label>Уровень поддержки</label><select id=\"fSupport\">" + supportOptions(skill.fields.support_level) + "</select><label>Описание</label><textarea id=\"fDesc\">" + esc(descriptionBody(skill.body)) + "</textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    skill.fields.goal_id = dialog.querySelector("#fGoal").value;
    skill.fields.status = dialog.querySelector("#fStatus").value;
    skill.fields.mastery_score = Math.max(0, Math.min(100, Math.floor(Number(dialog.querySelector("#fMastery").value) || 0)));
    skill.fields.support_level = Number(dialog.querySelector("#fSupport").value);
    skill.fields.updated = now();
    await saveEntity(skill, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Навык обновлён");
  });
}
function dlgEditQuest(id){
  const quest = get("quest", id); if (!quest) return;
  const selected = new Set(Array.isArray(quest.fields.skill_ids) ? quest.fields.skill_ids : []);
  const options = byType("skill").map((skill) => '<option value="' + esc(skill.id) + '"' + (selected.has(skill.id) ? " selected" : "") + '>' + esc(skill.title) + "</option>").join("");
  openDialog("<h3>✎ Изменить квест</h3><label>Название</label><input id=\"fTitle\" value=\"" + esc(quest.title) + "\"><label>Навыки</label><select id=\"fSkills\" multiple size=\"4\">" + options + "</select><label>Статус</label><select id=\"fStatus\">" + statusOptions(QUEST_STATUS, quest.fields.status) + "</select><label>XP (0 = поддержание без награды)</label><input id=\"fXp\" type=\"number\" min=\"0\" max=\"100000\" value=\"" + questXp(quest) + "\"><label>Уровень поддержки</label><select id=\"fSupport\">" + supportOptions(quest.fields.support_level) + "</select><label>Описание</label><textarea id=\"fDesc\">" + esc(descriptionBody(quest.body)) + "</textarea>", async (dialog) => {
    const title = dialog.querySelector("#fTitle").value.trim(); if (!title) { show("Нужно название"); return false; }
    const skillIds = [...dialog.querySelector("#fSkills").selectedOptions].map((option) => option.value);
    if (!skillIds.length) { show("Выбери хотя бы один навык"); return false; }
    const xp = Math.max(0, Math.floor(Number(dialog.querySelector("#fXp").value) || 0));
    quest.fields.skill_ids = skillIds;
    quest.fields.status = dialog.querySelector("#fStatus").value;
    if (quest.fields.status === "completed") { if (!quest.fields.completed_at) quest.fields.completed_at = now(); } else { delete quest.fields.completed_at; }
    quest.fields.xp_reward = xp;
    quest.fields.maintenance = xp === 0;
    quest.fields.support_level = Number(dialog.querySelector("#fSupport").value);
    quest.fields.updated = now();
    await saveEntity(quest, title, dialog.querySelector("#fDesc").value.trim());
    await afterWrite("Квест обновлён");
  });
}
function dlgComplete(id){
  const quest = get("quest", id); if (!quest) return;
  openDialog("<h3>✅ Выполнить: " + esc(quest.title) + "</h3><label>Что получилось / рефлексия (попадёт в описание квеста)</label><textarea id=\"fNote\" placeholder=\"Например: сыграл без остановок, сложнее всего был переход на F\"></textarea>", async (dialog) => {
    quest.fields.status = "completed"; quest.fields.completed_at = now(); quest.fields.updated = now();
    let body = descriptionBody(quest.body);
    const note = dialog.querySelector("#fNote").value.trim();
    if (note) body = (body ? body + "\n\n" : "") + "**Выполнено " + now().slice(0, 10) + ":** " + note;
    await saveEntity(quest, quest.title, body);
    await afterWrite("Квест выполнен ✦ Не забудь импортировать папку на телефоне");
  });
}
async function reopenQuest(id){
  const quest = get("quest", id); if (!quest) return;
  quest.fields.status = "active"; delete quest.fields.completed_at; quest.fields.updated = now();
  await saveEntity(quest, quest.title, descriptionBody(quest.body));
  await afterWrite("Квест снова в работе");
}
function dlgReview(){
  openDialog("<h3>🗓️ Обзор недели</h3><label>Что получилось</label><textarea id=\"fAch\"></textarea><label>Что мешало</label><textarea id=\"fBlock\"></textarea><label>Решение на следующую неделю (обязательно)</label><textarea id=\"fDec\"></textarea>", async (dialog) => {
    const decisions = dialog.querySelector("#fDec").value.trim(); if (!decisions) { show("Реши, что делаешь на следующей неделе"); return false; }
    const weekStart = mondayOf(new Date());
    const id = newId("review");
    const parsed = { id, type: "weekly_review", title: "", body: "", fields: { levera_id: id, levera_type: "weekly_review", profile_id: "pavel", week_start: weekStart, completed_at: now() } };
    await saveEntity(parsed, "Weekly review · " + weekStart, reviewBody(dialog.querySelector("#fAch").value.trim(), dialog.querySelector("#fBlock").value.trim(), decisions));
    await afterWrite("Обзор недели сохранён");
  });
}
async function afterWrite(message){ await loadVault(); show(message + (vault.demo ? " (демо)" : "")); }
