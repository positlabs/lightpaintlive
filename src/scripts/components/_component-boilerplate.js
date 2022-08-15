var styles = require('../../styles/m-button.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('./m-base')

class MButton extends MBase {

  static get properties() {
    return {
      content: String,
    }
  }

  constructor() {
    super()
  }

  _render(props) {
    return html`
		<style>${styles}</style>
	`}

  _firstRendered() { }
  _shouldRender(props, changedProps, prevProps) { }
  _didRender(props, changedProps, prevProps) { }

}

customElements.define('m-button', MButton)
