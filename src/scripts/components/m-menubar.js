var styles = require('../../styles/m-menubar.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')
// var app = electron.remote.app
var {version} = require('../../../package.json')

class MMenuBar extends MBase {
  
  constructor() {
    super()
    // var win = electron.remote.app.getCurrentWindow()
    // win.addListener('enter-full-screen', this._onFullscreenChanged.bind(this))
    // win.addListener('leave-full-screen', this._onFullscreenChanged.bind(this))
    // FIXME window events
    window.addEventListener('fullscreenchange', this._onFullscreenChanged.bind(this))
  }

  _firstRendered() {
    this._onFullscreenChanged()
  }

  _render() {
    return html `
    <style>${styles}</style>
    <div class='btns'>
      <div id='close-btn' class='btn' on-click='${this._onClickClose.bind(this)}' title='quit'>×</div>
      <div id='minimize-btn' class='btn' on-click='${this._onClickMinimize.bind(this)}'>–</div>
      <div id='maximize-btn' class='btn' on-click='${this._onClickMaximize.bind(this)}' title='maximize'>+</div>
      <div id='fullscreen-btn' class='btn' on-click='${this._onClickFullscreen.bind(this)}' title='fullscreen'>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="512px" height="512px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve" fill="white">
          <path d="M0,402.286h109.714V512h73.144V329.143H0V402.286z M109.714,109.714H0v73.144h182.857V0h-73.144V109.714z M329.143,512  h73.144V402.286H512v-73.144H329.143V512z M402.286,109.714V0h-73.144v182.857H512v-73.144H402.286z"/>
        </svg>
      </div>
    </div>
    <div class='version'>${version}</div>
    <div id='drag-bar' on-dblclick='${this._onClickMaximize.bind(this)}'>
      <div class='bg'></div>
    </div>`
  }

  _onFullscreenChanged() {
    if (document.fullscreenElement) {
      // if (win.isFullScreen()) {
      this.classList.add('hover-reveal')
    } else {
      this.classList.remove('hover-reveal')
    }
  }

  _onClickClose() {
    //FIXME: window
    win.close()
  }

  _onClickMinimize() {
    //FIXME: window
    win.minimize()
  }

  _onClickMaximize() {
    //FIXME: window
    win.isMaximized() ? win.unmaximize() : win.maximize()
  }

  _onClickFullscreen() {
    //FIXME: window
    win.setFullScreen(!win.isFullScreen())
  }

}

customElements.define('m-menubar', MMenuBar)
