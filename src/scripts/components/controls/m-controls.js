var mainStyles = require('../../../styles/main.scss')
var styles = require('../../../styles/m-controls.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

var {
  remote,
  ipcRenderer,
  shell
} = require('electron')
var win = remote.getCurrentWindow()
var {
  dialog
} = require('electron').remote

require('./m-button')
require('./m-checkbox')
require('./m-slider')
require('./m-select')

class MControls extends MBase {

  static get properties() {
    return {
      minimized: Boolean,
      popped: Boolean,
      camera: Object,
      cameraNames: Object,
      resolution: String,
      resolutions: String,
      ghost: Number,
      mirror: Boolean,
      autoSnapshot: Boolean,
      recordVideo: Boolean,
      opacity: Number,
      decay: Number,
      state: String
    }
  }

  constructor() {
    super()
    this.minimized = false

    // set initial values
    var props = Object.keys(MControls.properties)
    props.forEach((key) => {
      this[key] = appModel[key]
    })
    this.watchAppModel()

    var mousemoveTimeout
    document.body.addEventListener('mousemove', () => {
      clearTimeout(mousemoveTimeout)
      mousemoveTimeout = setTimeout(() => {
        this.classList.remove('mouse-move')
      }, 2000)
      this.classList.add('mouse-move')
    })

    // kinda hacky way to wait for model values to settle...
    setTimeout(() => {
      this.isReady = true
    }, 3000)
  }

  _firstRendered() {

    // reflect controls values back to model
    this.findAll('m-slider').forEach(slider => {
      slider.addEventListener('value', (e) => {
        appModel[slider.id] = slider.value
      })
    })
    this.findAll('m-checkbox').forEach(checkbox => {
      checkbox.addEventListener('checked', (e) => {
        appModel[checkbox.id] = checkbox.checked
      })
    })
    this.findAll('m-select').forEach(select => {
      select.addEventListener('selection', (e) => {
        appModel[select.id] = select.selection
      })
    })

    // set size of popped window
    if (this.popped) {

      var mainStyleTag = document.createElement('style')
      mainStyleTag.innerText = mainStyles
      document.head.appendChild(mainStyleTag)

      var setBounds = () => {
        var opts = {
          x: screen.width - this.offsetWidth,
          y: screen.height - this.offsetHeight,
          width: this.offsetWidth,
          height: this.offsetHeight,
        }
        console.log(opts)
        win.setBounds(opts)
      }
      setBounds()
      // setTimeout(setBounds, 2000)
    }
  }

  watchAppModel() {
    var props = Object.keys(MControls.properties)
    props.forEach(key => {
      appModel.watch(key, value => {
        this[key] = value
      })
    })
  }

  // <!--<a href="./controls.html" target="_blank" class="pop btn" hidden="${this.popped || this.minimized}" on-click="${this._onClickPopout.bind(this)}" title='pop out control panel'>^</a>-->
  _render() {
    return html `
      <style>${styles}</style>

      <div id="indicator" state$="${this.state}"></div>

      <div class="btn min-max" minimized$="${this.minimized}" hidden="${this.popped}" on-click="${this._onClickMinMax.bind(this)}" title='[/] show/hide controls'>
        <span hidden="${this.minimized}">–</span>
        <span hidden="${!this.minimized}">+</span>
      </div>
      <div class="pop btn" hidden="${this.popped || this.minimized}" on-click="${this._onClickPopout.bind(this)}" title='pop out control panel'>^</div>
      <div class="remote btn" hidden="${this.popped || this.minimized}" on-click="${this._onClickRemote.bind(this)}" title='control Mercury with your phone'>
        <img src="assets/imgs/remote-icon.svg" />
      </div>

      <div class="drag-bar" hidden="${!this.popped}">
        <div class="grab-dots"></div>
        <div class="close btn" on-click="${this._onClickClose.bind(this)}">×</div>
      </div>

      <m-select id="camera" label="camera" options=${this.cameraNames} selection=${this.camera} title='webcam selector'></m-select>
      <m-select id="resolution" label="resolution" options=${this.resolutions} selection=${this.resolution} title='webcam resolution selector'></m-select>

      <m-checkbox id="mirror" checked="${this.mirror}" title='[m] Flip canvas'>mirror</m-checkbox>
      <m-checkbox id="recordVideo" checked="${this.recordVideo}" title='Records videos'>record video</m-checkbox>

      <m-slider id="ghost" min="0" max="100" value=${this.ghost} title='[g,h] Control brightness of camera overlay'>ghost</m-slider>
      <m-slider id="opacity" min="0" max="100" value=${this.opacity} title='[{,} or alt+(~,0-9)] Accumualtor frame transparency'>opacity</m-slider>
      <m-slider id="decay" min="0" max="100" value=${this.decay} title='[d,f] Rate of decay'>decay</m-slider>

      <button id="save-dir" on-input="${this.onChooseSaveDir.bind(this)}">
        choose save folder
        <input type="file" webkitdirectory=""/>
      </button>

      <m-button on-click="${this._snapshot.bind(this)}" title='[s] Save image snapshot'>snapshot</m-button>
      <m-button on-click="${this._new.bind(this)}" title='[n] New painting'>new</m-button>
      <m-button on-click="${this._trigger.bind(this)}" title='[spacebar] Start / pause / resume'>trigger</m-button>
    `
  }
  // <m-checkbox id="autoSnapshot" checked="${this.autoSnapshot}" title='Automatically save images after each session'>auto-snapshot</m-checkbox>
  onChooseSaveDir(e) {
    console.log('onChooseSaveDir', e.target.files[0])
    appModel.saveDir = e.target.files[0].path
  }

  _propertiesChanged(props, changedProps, prevProps) {
    super._propertiesChanged(...arguments)
    // console.log('m-controls._propertiesChanged', props, changedProps, prevProps)

    if (changedProps.camera) {
      this._changed_camera(changedProps.camera, prevProps.camera)
    }

    if (changedProps.minimized !== undefined) {
      this._changed_minimized(changedProps.minimized, prevProps.minimized)
    }
  }

  _changed_camera(newVal, prevVal) {
    // console.log('!!!!!!111MControls._changed_camera', newVal, prevVal)
    // select a video file if user chose to do so
    // only if we are in main window, not popped
    if (this.camera === 'Video file' && prevVal !== '' && !this.popped && this.isReady) {
      // don't select a new video file if user dropped it
      // if (!appModel.dropFlag) {
        // prompt file selection
        // this._selectVideoFile().then((file) => {
          // const vid = URL.createObjectURL(file)
        // appModel.set('videoFile', '')
      appModel.set('camera', this.camera)
      if (!appModel.dropFlag) {
        window.toast('drag & drop a video file')
        appModel.set('videoFile', '')
      }
      appModel.dropFlag = false
        // })
      // }
    } else {
      appModel.set('camera', this.camera)
    }
  }

  _changed_minimized() {
    var y = 0
    if (this.minimized) {
      y = this.offsetHeight - 31
    }
    TweenLite.to(this, 0.7, {
      y: y,
      ease: Power3.easeOut
    })
  }

  _snapshot() {
    this._sendAction(actions.SNAPSHOT)
  }
  _trigger() {
    this._sendAction(actions.TRIGGER)
  }
  _new() {
    this._sendAction(actions.NEW)
  }

  _sendAction(action) {
    console.log('_sendAction', action)
    if (this.popped) {
      ipcRenderer.send('ACTION', action)
    } else {
      actions.emit(action)
    }
  }

  _onClickMinMax(e) {
    this.minimized = !this.minimized
  }

  _onClickPopout() {
    this.minimized = true
    ipcRenderer.send('POPOUT_CONTROLS', appModel._properties)
    toast('opening control window')
  }

  _onClickRemote() {
    shell.openExternal('http://' + appModel.controlServerAddress)
    console.log('_onClickRemote', appModel.controlServerAddress)
  }

  _onClickClose() {
    setImmediate(() => {
      var win = require('electron').remote.getCurrentWindow()
      win.close()
    })

    // have to remove so detached() gets called and things get cleaned up
    // this.remove()
    // setTimeout(() => {
        // window.close()
      // ipcRenderer.send('POPOUT_CONTROLS_CLOSED')
    // }, 1)
  }

  // _selectVideoFile() {
    // console.log('_selectVideoFile', this.videoInput)
    // this.videoInput.click()
    // return new Promise((resolve, reject) => {
    //   dialog.showOpenDialog({
    //     properties: [
    //       'openFile'
    //     ],
    //     filters: {
    //       name: 'video',
    //       extensions: ['mp4', 'webm', 'avi', 'ogv', 'mov']
    //     }
    //   }, function (selectedFilePaths) {
    //       console.log('selectedFilePaths', arguments)
    //     if (selectedFilePaths) {
    //       console.log('selectedFilePaths', selectedFilePaths[0])
    //       // TODO create file object url from file path
    //       resolve(selectedFilePaths[0])
    //     }
    //   })
    // })
  // }

  // _onVideoPicked(e) {
  //   console.log('_onVideoPicked', e.target.value)
  //   // set file path to trigger init stuff
  //   const vid = URL.createObjectURL(e.target.files[0])
  //   appModel.set('videoFile', vid)
  //   appModel.set('camera', this.camera)
  // }
}

customElements.define('m-controls', MControls)
