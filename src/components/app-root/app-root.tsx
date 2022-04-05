import { Host, Component, h } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: false,
})
export class AppRoot {
  render() {
    return (
      <Host>
        <stencil-router>
          <stencil-route-switch scrollTopOffset={0}>
            <stencil-route url="/" component="lpl-landing" exact={true} />
            {/* TODO */}
            {/* <stencil-route url="/privacy" component="lpl-privacy" /> */}
          </stencil-route-switch>
        </stencil-router>
      </Host>
    );
  }
}
