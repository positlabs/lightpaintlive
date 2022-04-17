var styles = require('../../../styles/m-checkbox.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

class MCheckbox extends MBase {

  static get properties() {
    return {
      checked: Boolean,
    }
  }

  constructor() {
    super()
    // console.log('MCheckbox.constructor')
    if (this.innerHTML.length) {
      this.content = this.innerHTML
    }
    this.addEventListener('click', () => {
      this.checked = !this.checked
    })
  }

  _didRender(props, changedProps, prevProps) {
    // console.log('m-checkbox._propertiesChanged', props, changedProps, prevProps)
    this.contentEl = this.find('.content')
    if (props.checked !== undefined) {
      if (props.checked) this.contentEl.setAttribute('checked', props.checked)
      else this.contentEl.removeAttribute('checked')
    }
  }

  _render() {
    return html `
      <style>${styles}</style>
      <div class='content'>
        <div class='label'>
          ${this.content}
        </div>
        <div class='box'></div>
      </div>
    `
  }
}

customElements.define('m-checkbox', MCheckbox)
