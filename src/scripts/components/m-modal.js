var styles = require('../../styles/m-modal.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

class MModal extends MBase {

  static get properties() {
    return {
      message: String,
    }
  }

  constructor() {
    super()
  }

  _render() {
    return html `
		<style>${styles}</style>
		<div id="content">
			<div id="close" class="btn" on-click="_onClickClose">×</div>
			<div class="message">${this.message}</div>
		</div>
	`
  }

  _propertiesChanged(props, changedProps, oldProps) {

  }

  _firstRendered() {
    TweenLite.fromTo(this.find('#content'), 0.5, {
      height: 0
    }, {
      opacity: 1,
      height: this.find('#content').offsetHeight,
      ease: Power3.easeOut,
      onComplete: () => {
        this.__onClickOff = this._onClickOff.bind(this)
        document.body.addEventListener('click', this.__onClickOff)
      }
    })
  }

  _onClickOff(e) {
    console.log(e)
    if (e.path.indexOf(this) === -1) {
      this._onClickClose()
    }
  }

  _onClickClose() {
    TweenLite.to(this.find('#content'), 0.3, {
      height: 0,
      opacity: 0,
      ease: Power3.easeOut,
      onComplete: () => {
        this.remove()
      }
    })
  }

  // detached (){
  // 	document.body.removeEventListener('click', this.__onClickOff)
  // }

  // TODO test this
  detachedCallback() {
    console.log('MModal.detachedCallback')
    document.body.removeEventListener('click', this.__onClickOff)
  }
}

customElements.define('m-modal', MModal)

// factory method, since creation of this will usually be imperative
window.modal = function (message, duration) {
  var el = document.createElement('m-modal')
  el.message = message
  document.body.appendChild(el)
}
