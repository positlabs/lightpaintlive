require('mousetrap')
var win = require('electron').remote.getCurrentWindow()

// FIXME use this in popped controls

Mousetrap.bind(['space', 'enter', 'return'], (e) => {
  e.preventDefault()
  actions.emit(actions.TRIGGER)
})
Mousetrap.bind(['n'], (e) => {
  actions.emit(actions.NEW)
})
Mousetrap.bind(['s'], (e) => {
  actions.emit(actions.SNAPSHOT)
})
Mousetrap.bind(['m'], (e) => {
  appModel.mirror = !appModel.mirror
})
Mousetrap.bind(['/'], (e) => {
  actions.emit(actions.TOGGLE_CONTROLS)
})

Mousetrap.bind(['k'], (e) => {
  appModel.maskEnabled = !appModel.maskEnabled
})

Mousetrap.bind(['-'], (e) => {
  if (appModel.proDesktop) {
    actions.emit(actions.FADE_OUT)
  }
})
Mousetrap.bind(['='], (e) => {
  if (appModel.proDesktop) {
    actions.emit(actions.FADE_IN)
  }
})

Mousetrap.bind(['g'], (e) => {
  appModel.ghost = !appModel.ghost
})

Mousetrap.bind(['[', 'left'], (e) => {
  appModel.opacity -= 1
})
Mousetrap.bind([']', 'right'], (e) => {
  appModel.opacity += 1
})

Mousetrap.bind(['d'], (e) => {
  appModel.decay -= 1
})
Mousetrap.bind(['f'], (e) => {
  appModel.decay += 1
})

Mousetrap.bind(['g'], (e) => {
  appModel.ghost -= 1
})
Mousetrap.bind(['h'], (e) => {
  appModel.ghost += 1
})

Mousetrap.bind(['l'], (e) => {
  actions.emit(actions.TOGGLE_LOGO)
})

const ten = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// opacity shortcuts
Mousetrap.bind(ten.map((i) => 'alt+' + i), (e) => {
  var val = parseInt(e.code.replace('Digit', ''))
  if (val === 0) val = 10
  appModel.opacity = val * 10
})
Mousetrap.bind(['alt+`'], (e) => {
  appModel.opacity = 0
})

// fullscreen
Mousetrap.bind(['f11', 'alt+f'], (e) => {
  win.setFullScreen(!win.isFullScreen())
})
Mousetrap.bind(['esc'], (e) => {
  if (win.isFullScreen()) {
    win.setFullScreen(false)
  }
})
