const { app, BrowserWindow, dialog, ipcMain, net } = require("electron");
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

const MAX_DEPTH = 4;

function vaultFile(name) {
  if (!vaultDir) throw new Error("\u041f\u0430\u043f\u043a\u0430 \u043d\u0435 \u0432\u044b\u0431\u0440\u0430\u043d\u0430");
  const segments = String(name).replace(/\\/g, "/").split("/").filter(Boolean);
  if (segments.length === 0 || segments.some((part) => part === "." || part === "..")) {
    throw new Error("\u041d\u0435\u0434\u043e\u043f\u0443\u0441\u0442\u0438\u043c\u044b\u0439 \u043f\u0443\u0442\u044c: " + name);
  }
  return path.join(vaultDir, ...segments);
}

async function listMarkdown(dir, prefix, depth) {
  const names = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      if (depth < MAX_DEPTH) {
        names.push(...(await listMarkdown(path.join(dir, entry.name), prefix + entry.name + "/", depth + 1)));
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      names.push(prefix + entry.name);
    }
  }
  return names;
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
  return listMarkdown(vaultDir, "", 0);
});

ipcMain.handle("vault:read", (_event, name) => fs.readFile(vaultFile(name), "utf8"));
ipcMain.handle("vault:write", async (_event, name, content) => {
  const target = vaultFile(name);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
});
ipcMain.handle("vault:remove", (_event, name) => fs.unlink(vaultFile(name)));

ipcMain.handle("ai:chat", async (_event, request) => {
  const response = await net.fetch(String(request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(request.apiKey || ""),
    },
    body: JSON.stringify(request.body || {}),
  });
  return { status: response.status, body: await response.text() };
});

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
