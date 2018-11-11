/*

	https://github.com/Polymer/lit-element
	https://github.com/Polymer/lit-element#api-documentation

*/
import {html} from '@polymer/lit-element'
import {default as ComponentBase} from './component-base'
const componentName = 'a-component'
const style = require(`../${componentName}.scss`)

class AComponent extends ComponentBase {

	static get properties() {
		return {
			mood: {type: String}
		}
	}

	constructor() {
		super()
		this.mood = 'happy'
	}

	render() {
		return html`<style>${style}</style>
			Web Components are <span class="mood">${this.mood}</span>!`
	}
}

customElements.define(componentName, AComponent)
export default AComponent
