// preload.js
const { contextBridge, ipcRenderer, dialog } = require('electron')

contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    dialog: {
      showOpenDialog: (options) => dialog.showOpenDialog(options)
    }
  }
)