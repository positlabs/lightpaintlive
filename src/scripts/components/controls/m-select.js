var styles = require('../../../styles/m-select.scss')
var {
  html
} = require('@polymer/lit-element')
var MBase = require('../m-base')

class MSelect extends MBase {

  static get properties() {
    return {
      label: String,
      selection: String,
      options: Array,
    }
  }

  constructor() {
    super()
    this.addEventListener('options', this._onOptionsChanged.bind(this))
  }

  _onOptionsChanged() {
    // console.log('m-select._onOptionsChanged', this.options)
    // set to first option if there is no selection attribute set
    // this.selection = this.selection // || this.options[0]
    this._setSelectedOption()
  }

  // selection property changed!
  _onSelectionChange(e) {
    // console.log('m-select._onSelectionChange', e)
    this._setSelectedOption()
  }

  // input selection changed!
  _onSelectChange(e) {
    // console.log('m-select._onSelectChange', e.currentTarget.value)
    this.selection = e.currentTarget.value
    this.find('select').blur()
  }

  // ensures the input's value reflects this.selection
  _setSelectedOption() {
    // console.log('m-select._setSelectedOption', this.options.indexOf(this.selection))
    var selectedIndex = this.options.indexOf(this.selection)
    this.find('select').selectedIndex = selectedIndex
    this.selectedIndex = selectedIndex
    // console.log(this._selectedIndex, this.selectedIndex)
  }

  _render() {
    console.log(this.label, this.selection, this.options)
    return html `
            <style>${styles}</style>
            <div class='label'>
                <span>${this.label}</span>: <span>${this.selection}</span>
            </div>
            <select name=${this.label} on-change=${this._onSelectChange.bind(this)}>
                ${this.options.map(item => html`<option value=${item}>${item}</option>`)}
            </select>
        `
  }

}

customElements.define('m-select', MSelect)
