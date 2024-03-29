var styles = require('../../styles/m-video-recorder.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

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
    setTimeout(async () => {
      const dir = appModel.saveDir
      
      var blob = new Blob(this.recordedChunks, { type: 'video/webm' })
      var buffer = await blob.arrayBuffer()

      electron.ipcRenderer.invoke('downloadVideo', {dir, filename, buffer})

      this.recordedChunks = []
    }, 500)
  }
}

customElements.define('m-video-recorder', MVideoRecorder)
