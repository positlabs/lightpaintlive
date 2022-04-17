var styles = require('../../styles/m-video-recorder.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

let path = require('path')
let fs = require('fs-extra')
let app = require('electron').remote.app

class MVideoRecorder extends MBase {

  _render() {
    return html `
      <style>${styles}</style>
      <div id="status"></div>
    `
  }

  record(canvas) {
    console.log('m-video-recorder.record()', canvas, this.canvas)

    if (this.canvas === undefined) {
      this.canvas = canvas
      this.stream = canvas.captureStream()

      this.recordedChunks = []
      var options = {
        mimeType: 'video/webm; codecs=vp9'
      }
      // var options = {mimeType: 'video/webm; codecs=vp8'}
      this.mediaRecorder = new MediaRecorder(this.stream, options)
      this.mediaRecorder.ondataavailable = function handleDataAvailable(event) {
        console.log('ondataavailable', event)
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }.bind(this)
    }

    this.mediaRecorder.start()
  }

  pause() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      // console.log('m-video-recorder.pause()')
      this.mediaRecorder.pause()
    }
  }

  resume() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      // console.log('m-video-recorder.resume()')
      this.mediaRecorder.resume()
    }
  }

  save(filename) {
    console.log('m-video-recorder.save', filename)
    if (this.mediaRecorder === undefined) return

    filename = filename || Date.now()

    toast('processing video...')

    if (this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }

    // not sure why, but chunks aren't saved immediately after stopping=
    setTimeout(() => {
      // let outPath = filename + '.webm'
      // let outPath = path.resolve('~/Desktop', filename + '.webm')
      const filedir = appModel.saveDir || app.getPath('downloads')
      let outPath = path.resolve(filedir, filename + '.webm')

      var blob = new Blob(this.recordedChunks, {
        type: 'video/webm'
      })
      let reader = new FileReader()
      reader.onload = function () {
        if (reader.readyState == 2) {
          var buffer = Buffer.from(reader.result)
          fs.outputFile(outPath, buffer, (err, res) => {
            if (err) console.error(err)
          })
        }
      }
      reader.readAsArrayBuffer(blob)
      this.recordedChunks = []
    }, 500)
  }
}

customElements.define('m-video-recorder', MVideoRecorder)
