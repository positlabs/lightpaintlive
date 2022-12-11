import { r as registerInstance, g as getElement } from './index-513c2c0d.js';

let ContextConsumer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.context = {};
    this.renderer = () => null;
  }
  connectedCallback() {
    if (this.subscribe != null) {
      this.unsubscribe = this.subscribe(this.el, 'context');
    }
  }
  disconnectedCallback() {
    if (this.unsubscribe != null) {
      this.unsubscribe();
    }
  }
  render() {
    return this.renderer(Object.assign({}, this.context));
  }
  get el() { return getElement(this); }
};

export { ContextConsumer as context_consumer };
