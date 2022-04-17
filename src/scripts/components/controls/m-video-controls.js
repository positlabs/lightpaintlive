var styles = require('../../../styles/m-video-controls.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

var remote = require('electron').remote
var win = remote.getCurrentWindow()

class MVideoControls extends MBase {

  static get properties() {
    return {}
  }

  constructor() {
    super()
    // this.state = 'paused'

    // only show video controls when there is a video file input
    appModel.watch('camera', this.onChangeCamera.bind(this))
    this.onChangeCamera()

    win.addListener('enter-full-screen', this._onFullscreenChanged.bind(this))
    win.addListener('leave-full-screen', this._onFullscreenChanged.bind(this))

    appModel.watch('videoElement', () => {
      this.video = appModel.videoElement
      this.video.addEventListener('play', () => {
        this.updatePlayPauseBtn()
      })
      this.video.addEventListener('pause', () => {
        this.updatePlayPauseBtn()
      })
      this.updatePlayPauseBtn()
      this.video.addEventListener('loadedmetadata', () => {
        this.seeker.max = this.video.duration
      })
      this.video.addEventListener('timeupdate', () => {
        this.seeker.value = this.video.currentTime
      })
    })

  }

  _render(props) {
    return html `
        <style>${styles}</style>
        <div id='play-pause'></div>
        <input id='seeker' type='range' step='.01'/>
        <label class='checkbox'>trigger control
            <input id='trigger-controls' type='checkbox' checked='${appModel.triggerControls}'/>
            <span class="checkmark"></span>
        </label>
        <label class='checkbox'>loop
            <input id='loop' type='checkbox' checked='${appModel.loopVideo}'/>
            <span class="checkmark"></span>
        </label>
	`
  }

  _firstRendered() {
    this.playBtn = this.find('#play-pause')
    this.seeker = this.find('#seeker')
    this.seeker.addEventListener('input', () => {
      this.video.currentTime = this.seeker.value
    })
    this.find('#trigger-controls').addEventListener('change', (e) => {
      appModel.triggerControls = e.target.checked
      e.target.blur()
    })
    this.find('#loop').addEventListener('change', (e) => {
      console.log('change loop', e.target.checked)
      appModel.loopVideo = e.target.checked
      e.target.blur()
    })
    this.playBtn.addEventListener('click', () => {
      if (this.video.paused) {
        this.video.play()
      } else {
        this.video.pause()
      }
    })
    this._onFullscreenChanged()
  }

  _didRender(props, changedProps, prevProps) {}

  onChangeCamera() {
    if (appModel.camera === 'Video file') {
      this.style.display = 'block'
    } else {
      this.style.display = 'none'
    }
  }

  updatePlayPauseBtn() {
    const state = this.video.paused ? 'paused' : 'playing'
    this.playBtn.setAttribute('state', state)
  }

  _onFullscreenChanged() {
    console.log('_onFullscreenChanged', win.isFullScreen())
    if (win.isFullScreen()) {
      this.classList.add('hover-reveal')
    } else {
      this.classList.remove('hover-reveal')
    }
  }
}

customElements.define('m-video-controls', MVideoControls)
