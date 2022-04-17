var styles = require('../../styles/m-toast.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

class MToast extends MBase {

  static get properties() {
    return {
      label: String,
      duration: Number,
    }
  }

  constructor() {
    super()
    this.duration = 3000
  }

  _render() {
    return html `
		<style>${styles}</style>
		<div id="label">${this.label}</div>
	`
  }

  _firstRendered() {
    // console.log(this.localName + '#' + this.id + ' was attached');
    setTimeout(() => {
      TweenLite.to(this.find('#label'), 0.3, {
        height: 0,
        opacity: 0,
        ease: Power3.easeOut,
        onComplete: () => {
          this.remove()
        }
      })
    }, this.duration)
    TweenLite.fromTo(this.find('#label'), 0.5, {
      height: 0
    }, {
      opacity: 1,
      height: '35px',
      ease: Power3.easeOut
    })
  }
}

customElements.define('m-toast', MToast)


// factory method, since creation of this will usually be imperative
window.toast = function (label, duration, callback) {
  callback = callback || function () {}
  var el = document.createElement('m-toast')
  el.label = label
  if (duration !== undefined) el.duration = duration
  document.body.appendChild(el)
  setTimeout(() => {
    callback()
  }, 500)
}
