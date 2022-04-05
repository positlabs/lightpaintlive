import { Component, Host, h, Element, Prop } from '@stencil/core';

@Component({
  tag: 'lpl-dl',
  styleUrl: 'lpl-dl.scss',
  shadow: true,
})
export class LplDl {

  @Prop() pro: Boolean
  @Element() el: HTMLElement

  showUI(name) {
    console.log('showUI', name,)
    this.$('.ui').style.display = 'none'
    this.$(`#${name}-ui`).style.display= 'block'
  }

  $(selector){
    return this.el.querySelector(selector) as HTMLElement
  }

  download(type = 'auto') {
    // this.showUI('download')

    const version = this.pro ? 4 : 3
    const manifest = `https://storage.googleapis.com/lightpaintlive.appspot.com/v${version}-latest.json`
    // TODO get manifest from somewhere else
    // TODO use fetch

    // $.get(manifest, {}, (data) => {
    //   // data = JSON.parse(data)
    //   console.log(data)
    //   var url
    //   var isMac = navigator.platform === 'MacIntel'
    //   var isWin = navigator.platform.indexOf('Win') !== -1
    //   // isWin = true; isMac = false;
    //   // isWin = false; isMac = false;
    //   if (type !== 'auto') {
    //     isMac = type === 'mac'
    //     isWin = type === 'win'
    //   }
    //   const proString = this.pro ? 'pro-' : ''
    //   if (isMac) {
    //     url = `https://storage.googleapis.com/lightpaintlive.appspot.com/builds/mac/lpl-mercury-${proString}${data.version}.dmg`
    //     // url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'.dmg'
    //   } else if (isWin) {
    //     url = `https://storage.googleapis.com/lightpaintlive.appspot.com/builds/win/lpl-mercury-${proString}${data.version}%20Setup.exe`
    //     // url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'+Setup.exe'
    //   }
    //   if (url) {
    //     window.location = url
    //   }
    // })
  }

  componentDidLoad() {
    if (!this.pro) {
      this.download()
    }
    this.$('.dl-btn').onclick = (e) => {
      // const type = e.currentTarget.getAttribute('type')
      // this.download(type)
    }
  }

  render() {
    return (
      <Host>
        <div class="wrapper">
          <div id="buy-ui" class="ui">
            <div class='panel'>
              <h1>Mercury Pro</h1>
              <h3>$30 for Mac & Windows</h3>
              <ul>
                <li>High bit depth colors</li>
                <li>Decay effect for continuous fade</li>
                <li>Ghost effect to control light capture</li>
                <li>Video file input</li>
                <li>Remote / mobile device controls</li>
                <li>Pop-out controls</li>
                <li>Access to all future updates</li>
              </ul>
              <google-pay></google-pay>
            </div>
          </div>
          <div id="download-ui" class="ui">
            <h1>Download Mercury ${this.pro ? 'Pro' : 'v3'}</h1>
            <p>
              <div class='dl-btn' data-type='mac'><img width='15' src='/assets/images/apple.svg'/> MAC INSTALLER</div>
              <div class='dl-btn' data-type='win'><img width='12' src='/assets/images/windows.svg'/> WIN INSTALLER</div>
            </p>
            <p>Your OS might try to block the installation. Here are instructions on how to get around that. <a class="shiny" href="http://kb.mit.edu/confluence/display/istcontrib/Allow+application+installations+and+temporarily+disable+Gatekeeper+in+OS+X+10.9+and+up" target="_blank">Mac</a><span>
              - </span><a class="shiny" href="https://www.windowscentral.com/how-fix-app-has-been-blocked-your-protection-windows-10" target="blank">Windows</a></p>
          </div>
        </div>
      </Host>
    );
  }

}
