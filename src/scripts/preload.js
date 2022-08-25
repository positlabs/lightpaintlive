const { contextBridge, ipcRenderer, shell} = require('electron')
console.log('preload.js')

contextBridge.exposeInMainWorld("semver", {...require('semver')})

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: { ...ipcRenderer, on: function(){
    ipcRenderer.on(...arguments)
  }},
  shell,
})
