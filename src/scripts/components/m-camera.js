var styles = require('../../styles/m-camera.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

// require('adapterjs')
// FIXME dialog
// var {
//   dialog
// } = electron.remote

class MCamera extends MBase {

  static get properties() {
    return {
      constraints: Object,
    }
  }

  constructor() {
    super()

    appModel.watch('camera', this.onCameraChange.bind(this))
    appModel.watch('videoFile', this.onVideoFileChange.bind(this))
    appModel.watch('resolution', this.onResolutionChange.bind(this))
    // appModel.watch('videoFile', this.onVideoFileChange.bind(this))

    // trigger play / pause based on triggerControls setting
    appModel.watch('state', () => {
      if (appModel.camera === 'Video file' && appModel.triggerControls) {
        if (appModel.state === states.PAINTING) {
          this.video.play()
        } else if (appModel.state === states.PAUSED || appModel.state === states.NEW) {
          this.video.pause()
        }
      }
    })

    appModel.watch('loopVideo', () => {
      // go ahead and set loop regardless since it won't affect webcam streams
      this.video.loop = appModel.loopVideo
    })

    this.constraints = {
      audio: false,
      video: {
        width: {
          ideal: 1280
        },
        height: {
          ideal: 720
        },
        // frameRate: { min: 30, ideal: 60, max: 60 }
      },
    }
  }

  _render() {
    return html `
    <style>${styles}</style>
    `
  }

  _firstRendered() {
    this._updateRes()

    this._getCameraList((cameras) => {
      console.log('got cameras', cameras)

      this._storeCameras(cameras)

      // get selected camera from local storage
      if (appModel.camera) {
        var cam = cameras.filter(cam => cam.label === appModel.camera)[0]
        if (cam) {
          this.constraints.video.deviceId = {
            exact: cam.deviceId
          }
        }
      }

      this._initCamera()
    })

    // hotplug!
    setInterval(() => {
      this._getCameraList(this._storeCameras)
    }, 6000)
  }

  _storeCameras(cameras) {
    appModel.cameras = JSON.stringify(cameras)
  }

  // detached() {
  // 	this.video.pause()
  // 	this.video.setAttribute('src', '')
  // 	if(this.stream) this.stream.stop()
  // }

  onVideoFileChange() {
    this._initCamera()
  }

  onCameraChange() {
    // console.log(appModel.camera, appModel.videoElement)
    if (appModel.camera !== 'Video file') {
      this._initCamera()
    }
  }
  onResolutionChange() {
    this._initCamera()
  }

  _initCamera() {

    // if(!this._isReady) return;
    console.log('m-camera._initCamera', this.constraints)

    if (this.stream) {
      this.stream.getVideoTracks()[0].stop()
    }
    if (this.video) {
      this.video.pause()
      this.video.remove()
      this.video.setAttribute('src', '')
    }

    this.video = document.createElement('video')
    this.video.volume = 0
    this.video.muted = true
    this.video.autoplay = true
    this.video.loop = true
    this.video.crossOrigin = 'anonymous'
    this.video.addEventListener('loadedmetadata', this._onPlay.bind(this))
    // this.video.addEventListener('play', this._onPlay.bind(this))
    this.video.addEventListener('canplaythrough', () => {
      this.video.play()
    })
    this.video.load()

    appModel.videoElement = this.video
    this.appendChild(this.video)

    // set specific camera
    if (appModel.camera) {
      var cam = JSON.parse(appModel.cameras).filter(cam => appModel.camera === cam.label)[0]
      if (cam) { // camera actually exists, so use it
        this.constraints.video.deviceId = {
          exact: cam.deviceId
        }
      }
    }

    this._updateRes()

    if (appModel.camera === 'Video file') {
      // console.log('*********************')
      console.log('using', appModel.videoFile)
      // appModel.dropFlag = false
      this.video.src = appModel.videoFile
      this.video.loop = appModel.loopVideo
      if (!appModel.triggerControls) {
        this.video.play()
      }
      return
    }

    navigator.getUserMedia.call(navigator, this.constraints,

      (stream) => {
        console.log('stream', stream.getVideoTracks()[0]);
        this.stream = stream
        this.video.srcObject = stream// (URL && URL.createObjectURL(stream)) || stream
        this.video.play()
      },

      (error) => {
        console.log('An error occurred: ' + (error.message || error.name))
        window.toast('error: ' + (error.message || error.name))
      }
    )
  }

  _onPlay() {
    // console.log('m-camera._onPlay')
    this.emit('play')
  }

  _getCameraList(callback) {
    navigator.mediaDevices.enumerateDevices().then( (devices) => {
      var cameras = devices.filter(device => device.kind === 'videoinput')
      callback(cameras)
    })
  }

  _updateRes() {

    var res = appModel.resolution,
      w = parseInt(res.split(':')[0]),
      h = parseInt(res.split(':')[1])

    this.constraints.video.width = {
      ideal: w
    }
    this.constraints.video.height = {
      ideal: h
    }
  }

  // onVideoFileChange(){
  // 	console.log('m-camera.onVideoFileChange')
  // 	// appModel.camera = 'Video file'
  // 	// this._initCamera()
  // }

}

customElements.define('m-camera', MCamera)
