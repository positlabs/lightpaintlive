const { contextBridge, ipcRenderer, BrowserWindow} = require('electron');
console.log('preload.js')

contextBridge.exposeInMainWorld("semver", {...require('semver')})

// const win = BrowserWindow.getCurrentWindow()

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: { ...ipcRenderer, on: ipcRenderer.on },
  path: require('path'),
  
  // FIXME create ipc handler for window actions
  // https://stackoverflow.com/questions/30681639/how-can-i-access-the-browserwindow-javascript-global-from-the-main-process-in-el
  // remote: {
  //   app: {
  //     getCurrentWindow: () => win,
  //   }
  // }

});
