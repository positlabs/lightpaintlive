var styles = require('../../styles/m-droptarget.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

class MDroptarget extends MBase {

  _render() {
    return html `
    <style>${styles}</style>
    <div id="drop-input-holder">
      <input type="file" id="dropFileInput" accept="video/*">
    </div>
  `
  }

  constructor() {
    super()
    // console.log(this.localName + '#' + this.id + ' was created')
    document.addEventListener('dragover', this._onDragOver.bind(this))
    document.addEventListener('drop', this._onDrop.bind(this))
  }

  _firstRendered() {
    this.find('#drop-input-holder').addEventListener('dragleave', this._onDragLeave.bind(this))
    this.find('#drop-input-holder').addEventListener('drop', this._onDragLeave.bind(this))
  }

  _onDrop(e) {
    console.log('_onDrop', e.dataTransfer.files[0])
    e.preventDefault()
    this._setFile(e.dataTransfer.files[0])
  }

  _onDragOver(e) {
    // console.log(this.localName + '._onDragOver', e)
    this.find('#drop-input-holder').style.display = 'block'
  }

  _onDragLeave() {
    // console.log(this.localName + '._onDragLeave')
    this.find('#drop-input-holder').style.display = 'none'
  }

  _setFile(file) {

    // validate file type
    if (file.name.toLowerCase().match(/\.webm|\.mp4|\.ogg|\.avi/)) {
      // store video file on model
      appModel.dropFlag = true
      // change camera type
      appModel.camera = 'Video file'
      const vid = URL.createObjectURL(file)
      appModel.set('videoFile', vid)
      // appModel.set('videoFile', file.path)
    } else {
      window.toast('Wrong file type!')
    }

    this.find('#drop-input-holder').style.display = 'none'
  }
}

customElements.define('m-droptarget', MDroptarget)
