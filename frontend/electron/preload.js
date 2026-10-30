const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  showSaveDialog: (options) => ipcRenderer.invoke('dialog-save-file', options),
  showOpenDialog: (options) => ipcRenderer.invoke('dialog-open-file', options),
  saveProjectFile: (filePath, data) => ipcRenderer.invoke('file-save', filePath, data),
  readProjectFile: (filePath) => ipcRenderer.invoke('file-read', filePath)
});
