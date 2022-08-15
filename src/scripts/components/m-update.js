var styles = require('../../styles/m-update.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')
let path = electron.path
// let path = require('path')
// FIXME ipc communication
// let fs = require('fs-extra')
// let opn = require('opn')
// let os = require('os')
// let request = require('request')
// let semver = require('semver')
// FIXME expose this value
// let app = require('electron').remote.app
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
      console.log(release.name, version)

      // determine version
      if (semver.gt(release.name, version)) {
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
    })

    this.find('.btn.skip').addEventListener('click', this.hide.bind(this))
    this.find('.btn.download').addEventListener('click', this.download.bind(this))
  }

  download() {
    this.hide()
    toast('Downloading update...')

    // download clicked
    const extension = os.type() === 'Darwin' ? 'dmg' : 'exe'
    let osAsset = this.latestRelease.assets.filter(asset => {
      return asset.browser_download_url.split('.').pop() === extension
    })
    let url = osAsset[0].browser_download_url

    // FIXME fs, opn
    let dlPath = path.join(app.getPath('downloads'), 'lpl-mercury-latest') + `.${extension}`
    // console.log(url)
    // request(url, (err, res) => {
    //   if (err) return console.error(err)
    //   opn(dlPath)
    //   toast('Installing update...')
    // }).pipe(fs.createWriteStream(dlPath))
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
