const {
  // ipcRenderer
  ipcMain
} = require('electron')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const ip = require('ip')

// TODO ensure port is available
const port = 3333

module.exports = {
  create(ipcRenderer) {

    app.use((req, res, next) => {
      console.log(req.path)
      next()
    })

    app.get('/', (req, res) => {
      var remoteControlsHTMLPath = path.resolve(__dirname, '../remote-controls.html')
      res.sendFile(remoteControlsHTMLPath)
      // res.send(remoteControlsHTML)
    })

    app.use('/dist', express.static(path.join(__dirname, '../dist')))
    app.use('/assets', express.static(path.join(__dirname, '../assets')))

    http.listen(port, () => {
      console.log(`listening on *:${port}`)
    })

    io.on('connection', (socket) => {
      console.log('a user connected')
      socket.emit('MODEL_INIT', appModel._properties)
      socket.on('action', (action) => {
        console.log('socket action', action)
        actions.emit(action)
      })
      // model props from remote controls
      socket.on('property', (key, val) => {
        console.log('socket property', key, val)
        appModel.set(key, val, true)
        // send to popped controls
        ipcRenderer.send('MODEL_CHANGE', key, val)
      })
      // model props to remote controls
      Object.keys(appModel._properties).forEach(key => {
        appModel.watch(key, (val, oldVal, silent) => {
          if (!silent) {
            socket.emit('property', key, val)
            console.log('socket emit property', key, val)
          }
        })
      })
    })

    // TODO test this
    // use invoke
    ipcMain.handle('MODEL_CHANGE', (event, key, value) => {
      io.emit('property', key, value)
    })
    // ipcRenderer.on('MODEL_CHANGE', (event, key, value) => {
    //   io.emit('property', key, value)
    // })

    const controlServerAddress = `${ip.address()}:${port}`
    console.log('http://' + controlServerAddress)
    return controlServerAddress
  }
  // address: `${ip.address()}:${port}`
}
