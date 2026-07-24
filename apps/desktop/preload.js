const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("leveraVault", {
  getFolder: () => ipcRenderer.invoke("vault:getFolder"),
  pickFolder: () => ipcRenderer.invoke("vault:pickFolder"),
  list: () => ipcRenderer.invoke("vault:list"),
  read: (name) => ipcRenderer.invoke("vault:read", name),
  write: (name, content) => ipcRenderer.invoke("vault:write", name, content),
  remove: (name) => ipcRenderer.invoke("vault:remove", name),
});

contextBridge.exposeInMainWorld("leveraAI", {
  chat: (request) => ipcRenderer.invoke("ai:chat", request),
});
