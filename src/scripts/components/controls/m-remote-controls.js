var mainStyles = require('../../../styles/main.scss')
var mainStyleTag = document.createElement('style')
mainStyleTag.innerText = mainStyles
document.head.appendChild(mainStyleTag)

var styles = require('../../../styles/m-remote-controls.scss')

require('../../globals')
require('./m-button')
require('./m-checkbox')
require('./m-slider')
require('./m-select')

var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

class MRemoteControls extends MBase {

  static get properties() {
    return {
      state: String,
      decay: Number,
      ghost: Number,
      opacity: Number,
      mirror: Boolean,
      recordVideo: Boolean,
      autoSnapshot: Boolean,
    }
  }

  constructor() {
    super()
    var socket = io()
    this.socket = socket

    // initialize the model
    socket.on('MODEL_INIT', (properties) => {
      console.log('MODEL_INIT', properties)
      Object.keys(properties).forEach((key, i) => {
        appModel.set(key, properties[key], true)
      })
    })

    // mirror properties from remote model to local model
    socket.on('property', (key, val) => {
      appModel.set(key, val, true)
      console.log('got property', key, val)
    })

    // mirror properties from local model to remote model
    Object.keys(MRemoteControls.properties).forEach(key => {
      appModel.watch(key, (value, prevValue, silent) => {
        console.log('aaa', key, value)
        this[key] = value
        // broadcast model changes to socket server
        if (!silent) {
          socket.emit('property', key, value)
        }
      })
    })

    // only brighten controls when they are being used
    var dimTimeout
    var brighten = () => {
      clearTimeout(dimTimeout)
      this.style.opacity = 1
      dimTimeout = setTimeout(() => {
        this.style.opacity = .5
      }, 3000)
    }
    document.body.addEventListener('mousemove', brighten.bind(this))
    document.body.addEventListener('touchmove', brighten.bind(this))
  }

  onClickButton(e) {
    // console.log('onClickButton', e.currentTarget.id)
    this.socket.emit('action', e.currentTarget.id)
  }

  _didRender(props, changedProps, prevProps) {
    super._didRender(...arguments)
    // console.log('m-remote-controls._didRender')

    // checkbox change listeners
    let checkboxes = [
      'mirror',
      'recordVideo'
    ]
    checkboxes.forEach(id => {
      this.find(`#${id}`).addEventListener('checked', (e) => {
        appModel[id] = e.detail
      })
    })

    // slider change listeners
    let sliders = [
      'ghost',
      'decay',
      'opacity'
    ]
    sliders.forEach(id => {
      console.log('slider', id, this.find(`#${id}`))
      this.find(`#${id}`).addEventListener('value', (e) => {
        console.log('value', e.detail)
        appModel[id] = e.detail
      })
    })

    this.find('#indicator').className = this.state
  }

  // <m-select label="resolution" options=${this.resolutions} selection=${this.resolution} title='webcam resolution selector'></m-select>
  // <m-select label="camera" options=${appModel.cameraNames} selection=${appModel.camera} title='webcam selector'></m-select>

  _render(props) {
    // console.log('m-remote-controls.render', props)
    this.style.opacity = 1
    setTimeout(() => this.find('#remote-ctrl-message').style.opacity = 0, 3000)

    return html `
			<style>${styles}</style>
			<div id="remote-ctrl-message">
				<h3>REMOTE CONTROLS</h3>
				<p>Load this page on your mobile device</p>
			</div>
			<m-checkbox id="mirror" checked=${props.mirror} title="[m] Flip canvas">mirror</m-checkbox>
			<m-checkbox id="recordVideo" checked=${props.recordVideo} title="Records videos">record video</m-checkbox>
			<m-slider id="ghost" min="0" max="100" value=${props.ghost} title="[g,h] Control brightness of camera overlay">ghost</m-slider>
			<m-slider id="opacity" min="0" max="100" value=${props.opacity} title="[{,} or alt+(~,0-9)] Accumualtor frame transparency">opacity</m-slider>
			<m-slider id="decay" min="0" max="100" value=${props.decay} title="[d,f] Rate of decay">decay</m-slider>
			<m-button on-click="${this.onClickButton.bind(this)}" id="${actions.SNAPSHOT}" title="[s] Save image snapshot">snapshot</m-button>
			<m-button on-click="${this.onClickButton.bind(this)}" id="${actions.NEW}" title="[n] New painting">new</m-button>
			<m-button on-click="${this.onClickButton.bind(this)}" id="${actions.TRIGGER}" title="[spacebar] Start / pause / resume">trigger</m-button>
			<div id="indicator"></div>
			`
    // <m-checkbox id="autoSnapshot" checked=${props.autoSnapshot} title="Automatically save images after each session">auto-snapshot</m-checkbox>
  }
}

customElements.define('m-remote-controls', MRemoteControls)
