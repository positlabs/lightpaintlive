// globals
require('../libs/gsap/esm/all.js')
require('./m-toast')
require('./m-modal')
require('../key-controller')

// const shell = require('electron').shell

var mainStyles = require('../../styles/main.scss')
var styles = require('../../styles/mercury-app.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

// FIXME control server
// var controlServer = require('../control-server.js')

require('./m-canvas')
require('./m-menubar')
require('./m-droptarget')
require('./m-update')
require('./controls/m-controls')
require('./controls/m-video-controls')

class MercuryApp extends MBase {

  static get properties() {
    return {
      state: String
    }
  }

  constructor() {
    super()
    console.log(this.localName + '#' + this.id + ' was created')

    const ms = document.createElement('style')
    ms.innerHTML = mainStyles
    document.head.appendChild(ms)

    document.querySelector('head title').innerText = 'Lightpaint Live Mercury: ' + appModel.version

    if (appModel.proDesktop) {
      document.body.classList.add('pro')
    }

    // FIXME control server
    // appModel.controlServerAddress = controlServer.address

    actions.on(actions.TOGGLE_CONTROLS, () => {
      this.find('m-controls').minimized = !this.find('m-controls').minimized
    })
    actions.on(actions.TOGGLE_LOGO, this._onToggleLogo.bind(this))
    appModel.watch('state', (state) => this.state = state)
  }

  _render() {
    return html `
      <style>${styles}</style>
      <m-menubar></m-menubar>
      <m-droptarget></m-droptarget>
      <m-update></m-update>
      <m-controls></m-controls>
      <m-video-controls></m-video-controls>
      <m-canvas></m-canvas>
      <a id="logo" class="logo" state$=${this.state} href="http://lightpaintlive.com" target="_blank" title="visit lightpaintlive.com">
        <img src="assets/icons/logo-green-icon-128.png">
        <div>LIGHTPAINT <span>LIVE</span></div>
      </a>
    `
  }

  _firstRendered() {
    // open links externally by default
    this.find('#logo').addEventListener('click', function (event) {
      event.preventDefault()
      // FIXME open url in browser window
      // shell.openExternal(this.href)
    })
  }

  _onToggleLogo() {
    this.find('#logo').classList.toggle('hidden')
  }
}

customElements.define('mercury-app', MercuryApp)
