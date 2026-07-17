const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs/promises");
const path = require("path");

const configPath = () => path.join(app.getPath("userData"), "config.json");

async function readConfig() {
  try {
    return JSON.parse(await fs.readFile(configPath(), "utf8"));
  } catch {
    return {};
  }
}

async function writeConfig(config) {
  await fs.mkdir(path.dirname(configPath()), { recursive: true });
  await fs.writeFile(configPath(), JSON.stringify(config, null, 2));
}

let vaultDir = null;

function vaultFile(name) {
  if (!vaultDir) throw new Error("\u041f\u0430\u043f\u043a\u0430 \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u0430");
  return path.join(vaultDir, path.basename(name));
}

ipcMain.handle("vault:getFolder", () => vaultDir);

ipcMain.handle("vault:pickFolder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (result.canceled || !result.filePaths[0]) return null;
  vaultDir = result.filePaths[0];
  await writeConfig({ vaultDir });
  return vaultDir;
});

ipcMain.handle("vault:list", async () => {
  if (!vaultDir) return [];
  const entries = await fs.readdir(vaultDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => entry.name);
});

ipcMain.handle("vault:read", (_event, name) => fs.readFile(vaultFile(name), "utf8"));
ipcMain.handle("vault:write", (_event, name, content) => fs.writeFile(vaultFile(name), content, "utf8"));
ipcMain.handle("vault:remove", (_event, name) => fs.unlink(vaultFile(name)));

app.whenReady().then(async () => {
  const config = await readConfig();
  if (config.vaultDir) {
    try {
      await fs.access(config.vaultDir);
      vaultDir = config.vaultDir;
    } catch {
      vaultDir = null;
    }
  }
  const window = new BrowserWindow({
    width: 1200,
    height: 820,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  window.removeMenu();
  window.loadFile(path.join(__dirname, "app", "index.html"));
});

app.on("window-all-closed", () => app.quit());
