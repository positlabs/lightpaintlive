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
            <stencil-route url="/profile/:name" component="app-profile" />
          </stencil-route-switch>
        </stencil-router>
      </Host>
    );
  }
}
