var styles = require('../../../styles/m-button.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

class MButton extends MBase {

  static get properties() {
    return {
      content: String,
    }
  }

  constructor() {
    super()
    if (this.innerHTML.length) {
      this.content = this.innerHTML
    }
  }

  // _createRoot(){ return this }

  _render() {
    return html `
      <style>${styles}</style>
      <label>${this.content}</label>
    `
  }
}

customElements.define('m-button', MButton)
