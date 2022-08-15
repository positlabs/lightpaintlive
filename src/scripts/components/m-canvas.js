var styles = require('../../styles/m-canvas.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

// FIXME ipc communication
// let fs = require('fs-extra')
let path = electron.path
// let path = require('path')
// let app = electron.remote.app
const moment = require('../libs/moment/moment.js')
let getDecay = (percentage) => (.2 - .005) * percentage / 100

require('./m-camera.js')
require('./m-video-recorder.js')

const Seriously = require('../libs/Seriously.js/seriously.js')
require('../libs/Seriously.js/effects/seriously.blend.js')
require('../libs/Seriously.js/effects/seriously.color.js')
require('../libs/Seriously.js/effects/seriously.exposure.js')
require('../effects/seriously.highlights-shadows.js')
require('../effects/seriously.accumulator.js')

class MCanvas extends MBase {

  _render() {
    return html `
		<style>${styles}</style>
		<canvas id="canvas"></canvas>
		<m-camera id="camera" on-play="${this._onCameraPlay.bind(this)}"></m-camera>
		<m-video-recorder id="videoRecorder"></m-video-recorder>
	`
  }

  constructor() {
    super()
    // console.log('m-canvas.created')
    this.seriously = new Seriously()

    var propsToWatch = [
      'opacity',
      'decay',
      'mirror',
      'ghost',
      'resolution',
      'camera',
    ]
    propsToWatch.forEach((prop) => {
      appModel.watch(prop, this['_' + prop + 'Changed'].bind(this))
    })
  }

  _firstRendered() {

    actions.on(actions.NEW, this._new, this)
    actions.on(actions.SNAPSHOT, () => this._snapshot(null, true), this)
    actions.on(actions.TRIGGER, this._onTrigger, this)
    actions.on(actions.OPACITY, this._onOpacity, this)
    actions.on(actions.MIRROR, this._onMirror, this)
    actions.on(actions.MODE, this._onMode, this)

    this._onResize = this._onResize.bind(this)
    window.addEventListener('resize', this._onResize)
  }

  _setupNodes() {
    // console.log('m-canvas._setupNodes')

    var s = this.seriously
    var n = this.nodes = {
      exposeGhost: s.effect('exposure'),
      blendGhost: s.effect('blend'),
      modAccSource: s.effect('highlights-shadows'),
      accumulator: s.effect('accumulator'),
      transform: s.transform('2d'),
      render: s.target(this.find('#canvas'))
    }

    // ghosting
    n.blendGhost.mode = 'lighten'
    n.exposeGhost.exposure = appModel.ghost / 100
    n.modAccSource.shadows = 1 - (appModel.ghost / 100)

    n.accumulator.opacity = 1
    n.accumulator.blendMode = 'normal'

    n.transform.scaleX = appModel.mirror ? -1 : 1

    n.accumulator.source = n.modAccSource
    n.blendGhost.top = n.exposeGhost
    n.blendGhost.bottom = n.accumulator
    n.transform.source = n.blendGhost
    n.render.source = n.transform

    // n.render.source = n.modAccSource
  }

  _onCameraPlay() {
    // console.log('m-canvas._onCameraPlay')

    if (!this.nodes) this._setupNodes()
    var n = this.nodes

    var cam = this.find('#camera')

    var w = cam.video.videoWidth,
      h = cam.video.videoHeight

    // console.log(w, h)

    // update dimensions of render target
    n.render.width = w
    n.render.height = h

    // update camera source because of new video stream
    n.camera = this.seriously.source(cam.video)

    n.modAccSource.source = n.camera
    // n.accumulator.source = n.camera
    n.exposeGhost.source = n.camera

    this._onResize()

    this.seriously.go()
    // this.seriously.go(this._onFrame.bind(this))

  }

  _onResize() {
    // console.log('m-canvas._onResize')

    // scale the canvas to fit the window
    try {
      var targ = this.find('#canvas')
    } catch (e) {
      return
    }

    var targW = targ.getAttribute('width'),
      targH = targ.getAttribute('height')

    var scaleX = window.innerWidth / targW
    var scaleY = window.innerHeight / targH
    var scale = Math.min(scaleX, scaleY)

    targ.style.width = scale * targW + 'px'
    targ.style.height = scale * targH + 'px'
  }

  /*

   model change handlers

  */

  _opacityChanged() {
    if (appModel.state == states.PAINTING) {
      this.nodes.accumulator.opacity = appModel.opacity * 0.01
    }
  }

  _decayChanged() {
    if (appModel.state == states.PAINTING) {
      this.nodes.accumulator.decay = getDecay(appModel.decay)
    }
  }

  _mirrorChanged() {
    this.nodes.transform.scaleX = appModel.mirror ? -1 : 1
  }

  _ghostChanged() {
    this.nodes.exposeGhost.exposure = appModel.ghost / 100
    // this.nodes.modAccSource.shadows = -appModel.ghost / 100
    this.nodes.modAccSource.shadows = 1 - appModel.ghost / 100
  }

  _cameraChanged() {
    this._onResize()
  }
  _resolutionChanged() {
    this._onResize()
  }

  /*

  	action handlers

  */

  _onTrigger() {
    // console.log("m-canvas._onTrigger", appModel.state)

    switch (appModel.state) {
      case states.NEW:
        this._start()
        break
      case states.PAINTING:
        this._pause()
        break
      case states.PAUSED:
        this._resume()
        break
    }
  }

  _start() {
    // console.log("m-canvas.start()")

    appModel.state = states.PAINTING

    // try to let black frame settle before we start painting
    setTimeout(() => {
      // this.nodes.blendBlack.opacity = 1 // no more black frame
      this.nodes.accumulator.opacity = appModel.opacity * 0.01
      this.nodes.accumulator.decay = getDecay(appModel.decay)
      this.nodes.accumulator.blendMode = 'lighten'
    }, 50)

    if (appModel.recordVideo) {
      this.find('#videoRecorder').record(this.find('#canvas'))
    }
  }

  _pause() {
    // console.log("m-canvas.pause()")
    appModel.state = states.PAUSED

    this.find('#videoRecorder').pause()

    this.nodes.accumulator.opacity = 0
    this.nodes.accumulator.decay = 0
  }

  _resume() {
    // console.log("m-canvas.resume()")
    appModel.state = states.PAINTING

    this.find('#videoRecorder').resume()

    // this.nodes.blendGhost.opacity = 0
    this.nodes.accumulator.blendMode = 'lighten'
    this.nodes.accumulator.opacity = appModel.opacity * 0.01
    this.nodes.accumulator.decay = getDecay(appModel.decay)

    this.seriously.go()
    // this.seriously.go(this._onFrame.bind(this))
  }

  _new() {
    // console.log("m-canvas.new()", arguments)

    // skip if we're already in the new state
    if (appModel.state === states.NEW) {
      return
    }

    if (appModel.recordVideo) {
      var filename = 'LPL-Mercury_' + moment().format('YYYY-MM-DD_HH-mm-ss')
      this.find('#videoRecorder').save(filename)
    }

    this._snapshot(() => {
      this._doNew()
    }, false)
  }

  _doNew() {

    appModel.state = states.NEW
    // show webcam feed
    this.nodes.accumulator.decay = 0
    this.nodes.accumulator.opacity = 1
    this.nodes.accumulator.blendMode = 'normal'
  }

  _snapshot(callback, notify) {
    // console.log('m-canvas._snapshot()')
    callback = callback || function () {}
    this._doSnapshot(notify)
    callback()
  }

  _doSnapshot(notify) {
    var dataURL = this.find('#canvas').toDataURL()

    // prepend autosave string unless the user explicitly requested to save
    var autoSaveString = 'auto_'
    if(notify) autoSaveString = ''

    var filename = autoSaveString + 'LPL-Mercury_' + moment().format('YYYY-MM-DD_HH-mm-ss') + '.png'
    var buffer = new Buffer(dataURL.replace('data:image/png;base64', ''), 'base64')

    // FIXME dlpath
    // let filepath = path.resolve(appModel.saveDir || app.getPath('downloads'), filename)
    // console.log(filepath)
    setTimeout(() => {
      // FIXME fs
      // fs.outputFile(filepath, buffer, err => {
      //   if (err) {
      //     console.error(err)
      //     alert(err.message)
      //   }
      // })

      // if (notify) {
      //   window.toast('saved snapshot')
      // }
    }, 200)
  }
}

customElements.define('m-canvas', MCanvas)
