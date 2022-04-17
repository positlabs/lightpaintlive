var styles = require('../../../styles/m-slider.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

class MSlider extends MBase {

  static get properties() {
    return {
      value: Number,
      min: Number,
      max: Number,
    }
  }

  constructor() {
    super()
    if (this.innerHTML.length) {
      this.content = this.innerHTML
    }
    this.addEventListener('mousedown', () => this._mouseDown = true)
    this.addEventListener('mouseleave', () => this._mouseDown = false)
    this.addEventListener('mouseup', () => this._mouseDown = false)
    this.addEventListener('mousemove', (e) => {
      if (this._mouseDown) {
        this._onTrack(e)
      }
    })
    this.addEventListener('click', this._onTrack)

    this.addEventListener('touchstart', () => this._mouseDown = true)
    this.addEventListener('touchend', () => this._mouseDown = false)
    this.addEventListener('touchmove', (e) => {
      if (this._mouseDown) {
        this._onTrack(e)
      }
    })
  }

  get normalizedValue() {
    return (this.value - this.min) / (this.max - this.min)
  }

  _didRender() {
    super._didRender(...arguments)
    console.log('MSlider._didRender')
    if (this.value > this.max) {
      this.value = this.max
      return
    }
    if (this.value < this.min) {
      this.value = this.min
      return
    }
    this.find('#indicator').style.transform = 'scaleX(' + this.normalizedValue + ')'
    // console.log('m-slider._onChangeValue', this.percentage, rect.width)
  }

  _onTrack(e) {
    // console.log(e)
    //TODO: implement step
    var rect = this.getBoundingClientRect()
    var pointerX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
    var value = (pointerX - rect.left) / rect.width * (this.max)
    value = Math.max(this.min, value)
    value = Math.min(this.max, value)
    this.value = value
  }

  _render({
    value
  }) {
    return html `
        <style>${styles}</style>
        <div class='label'>
            ${this.content}: <span class='value'>${Math.round(value)}</span>
        </div>
        <span id='indicator'></span>
        <input type='range'></input>
    `
  }
}

customElements.define('m-slider', MSlider)
