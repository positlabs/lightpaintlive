
import {LitElement} from '@polymer/lit-element'

/**
 * https://github.com/Polymer/lit-element
 */
class ComponentBase extends LitElement {
    find(selector){ return this.shadowRoot.querySelector(selector) }
    findAll(selector){ return this.shadowRoot.querySelectorAll(selector) }
    $(selector){
        return $(this.findAll(selector))
    }
    emit(eventName, detail){
        this.dispatchEvent(new CustomEvent(eventName, detail != undefined ? { detail } : undefined))
    }
}

customElements.define('component-base', ComponentBase)
export default ComponentBase
