// ---------- Theme ----------
const THEMES = ["auto", "light", "dark"];
const THEME_LABELS = { auto: "как в системе", light: "светлая", dark: "тёмная" };
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
function savedTheme(){
  const value = localStorage.getItem("levera-theme");
  return THEMES.includes(value) ? value : "auto";
}
function applyTheme(){
  const mode = savedTheme();
  const dark = mode === "dark" || (mode === "auto" && darkQuery.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const button = el("btnTheme");
  if (button) {
    button.textContent = mode === "auto" ? "🌗" : mode === "dark" ? "🌙" : "☀️";
    button.title = "Тема: " + THEME_LABELS[mode];
  }
}
darkQuery.addEventListener("change", applyTheme);
el("btnTheme").onclick = () => {
  const next = THEMES[(THEMES.indexOf(savedTheme()) + 1) % THEMES.length];
  localStorage.setItem("levera-theme", next);
  applyTheme();
  show("Тема: " + THEME_LABELS[next]);
};
el("btnAiSettings").onclick = () => dlgAiSettings();
applyTheme();

// ---------- Boot ----------
async function pickFolder(){
  if (window.leveraVault) {
    const folder = await window.leveraVault.pick();
    if (!folder) return;
    vault = desktopVault(folder);
    await loadVault();
    return;
  }
  if (!window.showDirectoryPicker) { show("Браузер не поддерживает выбор папки — открой в Chrome/Edge или нажми «Посмотреть на демо-данных»"); return; }
  try {
    const handle = await window.showDirectoryPicker({ mode: "readwrite" });
    await kvSet("dir", handle);
    vault = fsVault(handle);
    await loadVault();
  } catch (error) {
    if (error && error.name !== "AbortError") show("Не удалось открыть папку");
  }
}
async function tryRestore(){
  if (window.leveraVault) {
    const folder = await window.leveraVault.current();
    if (folder) { vault = desktopVault(folder); await loadVault(); return true; }
    return false;
  }
  try {
    const handle = await kvGet("dir");
    if (!handle) return false;
    if (await handle.queryPermission({ mode: "readwrite" }) !== "granted" && await handle.requestPermission({ mode: "readwrite" }) !== "granted") return false;
    vault = fsVault(handle);
    await loadVault();
    return true;
  } catch { return false; }
}
async function boot(){
  el("btnPick").onclick = pickFolder;
  el("btnPickBig").onclick = pickFolder;
  el("btnDemo").onclick = async () => { vault = demoVault(); await loadVault(); };
  el("btnReload").onclick = () => loadVault().then(() => show("Обновлено"));
  await tryRestore();
}
boot();
