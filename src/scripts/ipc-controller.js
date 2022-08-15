// require('./globals.js')
// const {ipcRenderer} = require('electron')
// import {ipcRenderer} from 'electron'
const { ipcRenderer } = electron

// forward actions from popped controls
ipcRenderer.on('ACTION', (event, action) => {
  console.log('ACTION', action)
  actions.emit(action)
})

ipcRenderer.on('MODEL_CHANGE', (event, key, value) => {
  console.log('MODEL_CHANGE', event, key, value)
  // silent set so it doesn't bounce back to sender
  appModel.set(key, value, true)
})

ipcRenderer.on('MODEL_INIT', (event, properties) => {
  Object.keys(properties).forEach(key => {
    appModel.set(key, properties[key], true)
  })
})

Object.keys(appModel._properties).forEach(key => {
  appModel.watch(key, (value, oldValue, silent) => {
    if (!silent) {
      console.log('MODEL_CHANGE', key, value)
      try {
        ipcRenderer.send('MODEL_CHANGE', key, value)
      } catch (e) {

      }
    }
  })
})
