import { r as registerInstance, h, e as Host } from './index-513c2c0d.js';

const appRootCss = "";

let AppRoot = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("stencil-router", null, h("stencil-route-switch", { scrollTopOffset: 0 }, h("stencil-route", { url: "/", component: "lpl-landing", exact: true })))));
  }
};
AppRoot.style = appRootCss;

export { AppRoot as app_root };
