var {
  LitElement
} = require('@polymer/lit-element')

/**
 * https://github.com/Polymer/lit-element
 */
class MBase extends LitElement {

  find(selector) {
    return this.shadowRoot.querySelector(selector)
  }
  findAll(selector) {
    return this.shadowRoot.querySelectorAll(selector)
  }

  _propertiesChanged(current, changed, old) {
    super._propertiesChanged(current, changed, old)
    if (!changed) return
    Object.keys(changed).forEach(key => {
      // console.log('MBase._propertiesChanged', key, changed[key])
      this.emit(key, changed[key])
    })
  }
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, detail != undefined ? {
      detail
    } : undefined))
  }
}

customElements.define('m-base', MBase)
module.exports = MBase
