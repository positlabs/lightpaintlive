// globals
require('../libs/gsap/esm/all.js')
require('../key-controller')

var mainStyles = require('../../styles/main.scss')
var styles = require('../../styles/mercury-app.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

// FIXME control server
// var controlServer = require('../control-server.js')

require('./m-toast')
// require('./m-modal')
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
    // console.log(this.localName + '#' + this.id + ' was created')

    const ms = document.createElement('style')
    ms.innerHTML = mainStyles
    document.head.appendChild(ms)

    document.querySelector('head title').innerText = 'Lightpaint Live Mercury: ' + appModel.version

    if (appModel.proDesktop) {
      document.body.classList.add('pro')
    }

    // FIXME control server
    // electron.ipcRenderer.invoke('createControlServer').then((e, info) => {
    //   appModel.controlServerAddress = info.controlServerAddress
    //   console.log('@@@@@@@@', info)
    // })

    actions.on(actions.TOGGLE_CONTROLS, () => {
      this.find('m-controls').minimized = !this.find('m-controls').minimized
    })
    actions.on(actions.TOGGLE_LOGO, this._onToggleLogo.bind(this))
    appModel.watch('state', (state) => this.state = state)
  }

  _render() {
    return html`
      <style>${styles}</style>
      <m-menubar></m-menubar>
      <m-droptarget></m-droptarget>
      <m-update></m-update>
      <m-controls></m-controls>
      <m-video-controls></m-video-controls>
      <m-canvas></m-canvas>
      <div id="donate">
        <div id="content">
          <div id="close" class="btn" on-click="_onClickClose">×</div>
          <p>Mercury is open source! If you use Mercury professionally, or simply enjoyed using the app, please consider supporting the project.</p>
          <p>Donations can be through <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YGS69CHAE9EQC&source=url" target="_blank">PayPal</a> or <a href="https://github.com/sponsors/positlabs" target="_blank">Github Sponsors</a>.</p>
          <p><a href="https://github.com/positlabs/lightpaintlive" target="_blank">View the project on Github</a></p>
        </div>
      </div>
      <a id="logo" class="logo" state$=${this.state} href="http://lightpaintlive.com" target="_blank" title="visit lightpaintlive.com">
        <img src="assets/icons/logo-green-icon-128.png">
        <div>LIGHTPAINT <span>LIVE</span></div>
      </a>
    `
  }

  _firstRendered() {
    // open links externally by default
    this.findAll('a').forEach(anchor => {
      anchor.addEventListener('click', function (event) {
        event.preventDefault()
        electron.shell.openExternal(this.href)
      })
    })
    // modal('If you used Mercury professionally, or simply enjoyed using the app, please consider a supporting the project. Donations can be through PayPal or Github Sponsors.')
    //     console.log('_firstRendered', ...arguments)
    const donateModal = this.find('#donate')
    const donateModalContent = this.find('#donate #content')
    
    TweenLite.fromTo(donateModalContent, 0.5, {
      height: 0
    }, {
      opacity: 1,
      height: donateModalContent.offsetHeight - 40,
      ease: Power3.easeOut,
      delay: 1,
      // onComplete: () => {
      //   this.__onClickOff = this._onClickOff.bind(this)
      //   document.body.addEventListener('click', this.__onClickOff)
      // }
    })
    function close() {
      TweenLite.to(donateModalContent, 0.3, {
        height: 0,
        opacity: 0,
        ease: Power3.easeOut,
        onComplete: () => {
          donateModal.remove()
        }
      })
      document.body.removeEventListener('click', close)
    }
    document.body.addEventListener('click', close)
  }

  _onToggleLogo() {
    this.find('#logo').classList.toggle('hidden')
  }
}

customElements.define('mercury-app', MercuryApp)
