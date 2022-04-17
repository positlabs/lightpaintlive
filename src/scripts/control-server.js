const {
  ipcRenderer
} = require('electron')
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var path = require('path')
var ip = require('ip')
var port = 3333
var remoteControlsHTML = require('../remote-controls.html')

app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.get('/', (req, res) => {
  // var remoteControlsHTMLPath = path.resolve(__dirname + '/remote-controls.html')
  // var remoteControlsHTMLPath = path.resolve(__dirname + '/../remote-controls.html')
  // console.log(remoteControlsHTMLPath)
  // res.sendFile(remoteControlsHTMLPath)
  res.send(remoteControlsHTML)
})

// app.get('/', express.static( path.join(__dirname, '../src') ))
// app.use('/dist', express.static( path.join(__dirname, '../dist') ))
// app.use(express.static('../dist'))
// window.controlserverdirname = __dirname
const fs = require('fs')
console.log(path.join(__dirname, '../dist'))
console.log(fs.readdirSync(path.join(__dirname, '../dist')))
app.use('/dist', express.static(path.join(__dirname, '../dist')))
app.use('/assets', express.static(path.join(__dirname, '../assets')))

console.log('CONTROL SERVER')
console.log('dist', path.resolve(__dirname, '../dist'))
console.log('assets', path.resolve(__dirname, '../assets'))

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

ipcRenderer.on('MODEL_CHANGE', (event, key, value) => {
  io.emit('property', key, value)
})

module.exports = {
  address: `${ip.address()}:${port}`
}

console.log(module.exports.address)
