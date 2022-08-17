var styles = require('../../styles/m-update.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')
let version = require('../../../package.json').version

class MUpdate extends MBase {

  constructor() {
    super()
  }

  _render() {
    return html`
		<style>${styles}</style>
		<div>There's an update available.<br>Would you like to download it?</div>
		<div class="btn skip">skip</div>
		<div class="btn download">download</div>
	`
  }

  _firstRendered() {
    fetch('https://api.github.com/repos/positlabs/lightpaintlive/releases/latest', {
      headers: {
        'User-Agent': 'lightpaintlive'
      }
    }).then(res => {
      return res.json()
    }).then(release => {
      this.latestRelease = release
      console.log('released:', release.name, 'current:', version)

      // determine version
      if (semver.gt(release.name, version)) {
        this.show()
      }
      // DEV
      // this.show()
    })

    this.find('.btn.skip').addEventListener('click', this.hide.bind(this))
    this.find('.btn.download').addEventListener('click', this.download.bind(this))
  }

  download() {
    this.hide()
    toast('Downloading update...')
    electron.ipcRenderer.send('update', {
      latestRelease: this.latestRelease
    })
  }

  show(){
    TweenMax.set(this, {
      y: '-50%'
    })
    TweenMax.to(this, .5, {
      display: 'block',
      opacity: 1,
      y: '0%',
      delay: 1
    })
  }

  hide() {
    TweenMax.to(this, .3, {
      display: 'none',
      opacity: 0,
      y: '-50%'
    })
  }
}

customElements.define('m-update', MUpdate)
