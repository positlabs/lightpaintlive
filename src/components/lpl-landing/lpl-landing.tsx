import { Component, Host, h, Element } from '@stencil/core';

@Component({
  tag: 'lpl-landing',
  styleUrl: 'lpl-landing.scss',
  shadow: false,
})
export class LplLanding {
  @Element() el: HTMLElement

  componentWillLoad() {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  componentDidLoad() {
    this.onResize()
    // this.$('iframe').onload = this.onResize.bind(this)
  }

  onResize() {
    // apply correct aspect ratio to youtube iframe
    const iframes = this.$$('iframe')
    iframes.forEach(iframe => {
      Object.assign(iframe.style, {
        height: iframe.offsetWidth * 9 / 16 + 'px'
      })
    })
  }

  sponsorButtons() {
    return (
      <div class="sponsor-buttons">
        <a class="github" target="_blank" href="https://github.com/sponsors/positlabs">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-heart icon-sponsor mr-1 v-align-middle color-fg-sponsors">
            <path fill-rule="evenodd" d="M4.25 2.5c-1.336 0-2.75 1.164-2.75 3 0 2.15 1.58 4.144 3.365 5.682A20.565 20.565 0 008 13.393a20.561 20.561 0 003.135-2.211C12.92 9.644 14.5 7.65 14.5 5.5c0-1.836-1.414-3-2.75-3-1.373 0-2.609.986-3.029 2.456a.75.75 0 01-1.442 0C6.859 3.486 5.623 2.5 4.25 2.5zM8 14.25l-.345.666-.002-.001-.006-.003-.018-.01a7.643 7.643 0 01-.31-.17 22.075 22.075 0 01-3.434-2.414C2.045 10.731 0 8.35 0 5.5 0 2.836 2.086 1 4.25 1 5.797 1 7.153 1.802 8 3.02 8.847 1.802 10.203 1 11.75 1 13.914 1 16 2.836 16 5.5c0 2.85-2.045 5.231-3.885 6.818a22.08 22.08 0 01-3.744 2.584l-.018.01-.006.003h-.002L8 14.25zm0 0l.345.666a.752.752 0 01-.69 0L8 14.25z"></path>
          </svg>
          <span>Sponsor on Github</span>
        </a>
        <a class="paypal" target="_blank" href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YGS69CHAE9EQC&source=url">
          <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" />
        </a>
      </div>
    )
  }

  render() {
    return (
      <Host>
        <div class="wrapper">
          <section id="about">
            <h1>Lightpaint Live</h1>
            <p>Light painting is a technique for creating surreal landscapes, portraits, or abstract artworks using long exposure photography.
              Traditionally, this is done with a DSLR or film camera, but Lightpaint Live enables artists to use live video as the input.
              It allows you to see the light collecting on the sensor in real time, just using a webcam!
              LPL can be used to create still images, timelapse videos, or live interactive performances or experiences.</p>
            <iframe class="ytplayer" 
              src="https://www.youtube.com/embed/jzrUNDacs1A?list=PLAZp2Vi7Gfsouo7T5XA39-M_swalzOs9C&listType=playlist&modestbranding=1&autoplay=1&mute=1&playsinline=1&start=6" 
              frameborder="0" allowFullScreen allow='autoplay'></iframe>
            <h2>Contributing</h2>
            <p>This project is now 100% free and open source! If you want to contribute, please submit tickets for feature requests or support on github issues, or sponsor the project via Github or Paypal.</p>
            {this.sponsorButtons()}
          </section>

          <section id="webapp">
            <h1>Cables Web app</h1>
            <p>Experimental browser-based app.</p>
            <div class="mercury-btns">
              <div class="pro-btn btn">
                <div class="icon"></div><a class="shiny" target='_blank' href="https://app.lightpaintlive.com/">Launch web app</a>
              </div>
            </div>
            <div class="links">
              <a class="shiny" href="https://github.com/positlabs/lightpaint-live-cables" target='_blank'>View on Github</a>
              <a class="shiny" href="https://cables.gl/edit/6kk1nZ" target='_blank'>Open Cables.gl editor</a>
              <a class="shiny" href="https://support.google.com/chrome/answer/9658361" target='_blank'>How to install web app</a>
            </div>
            <img class="splash" src="https://raw.githubusercontent.com/positlabs/lightpaint-live-cables/main/assets/screenshot.jpg" alt="" />
          </section>

          <section id="mercury">
            <h1>Mercury Desktop</h1>
            <p>Desktop app for Mac &amp; Windows. </p>
            <div class="mercury-btns">
              <div class="launch-btn btn">
                <div class="icon"></div><a href="https://github.com/positlabs/lightpaintlive/releases/latest" target='_blank'>Download for Mac/Win</a>
              </div>
            </div>
            <div class="links">
              <a class="shiny" href="https://github.com/positlabs/lightpaintlive" target='_blank'>View on Github</a>
            </div>
            <iframe class="ytplayer" src="https://www.youtube.com/embed/-zE527Nt460?list=PLAZp2Vi7Gfsouo7T5XA39-M_swalzOs9C&amp;listType=playlist&amp;modestbranding=1" frameborder="0" allowFullScreen></iframe>
          </section>
          <section id="faq">
            <h1>Frequently asked questions</h1>

            <h2>Can I use a DSLR with LPL?</h2>
            <p>Yes, but it requires 3rd party software (like <a class="shiny" href="http://extrawebcam.com/" target="_blank">extrawebcam</a>). Generally the video feed from DSLR to webcam is low
              resolution and low framerate. Webcams work best because they are made for streaming.</p>

            <h2>Which webcam is best?</h2>
            <p>We recommend Logitech webcams, like the <a class="shiny" href="https://www.amazon.com/Logitech-BRIO-Conferencing-Recording-Streaming/dp/B01N5UOYC4"
              target="_blank">Brio</a> or <a class="shiny" href="https://www.amazon.com/Logitech-Widescreen-Calling-Recording-Desktop/dp/B006JH8T3S"
                target="_blank">C920</a></p>

            <h2>How can I control exposure on my webcam?</h2>
            <p>Most webcams default to using auto-exposure. This is not ideal for light painting. In complete
              darkness, it will use the maximum exposure, which makes the video very noisy (like high ISO).
              Use your webcam's driver software to control settings on the webcam, or use a universal webcam
              controller
              like <a class="shiny" href="https://itunes.apple.com/us/app/webcam-settings/id533696630?mt=12"
                target="_blank">Webcam&nbsp;Settings</a> (Mac). <a class="shiny" href="https://obsproject.com/">OBS</a> also has webcam controls on Windows.</p>

            <h2>How can I force Mercury to use the dedicated GPU card?</h2>

            <h3>Nvidia</h3>
            <p>Open the NVIDIA control panel. Right-click on an empty area on your desktop and select the ‘NVIDIA Control Panel’ option from the context menu.</p>
            <p>Go to the Desktop menu and enable the ‘Add “Run with graphics processor” to Context Menu’ option.</p>
            <p>Add a shortcut to Mercury to the desktop, then right-click and select “Run with graphics processor”.</p>

            <h3>AMD</h3>
            <p>Open the AMD Catalyst Control Center app by right-clicking on an empty area on your desktop. Select ‘Catalyst Control Center’ from the context menu. From the list of panels on the left, select ‘Power’. Under ‘Power’, select ‘Switchable application graphics settings’. Add Mercury to this list.</p>
            <p>Read <a class="shiny" href='https://www.addictivetips.com/windows-tips/force-app-to-use-dedicated-gpu-windows/' target='_blank'>How To Force An App To Use The Dedicated GPU On Windows</a> for a more detailed explanation.</p>

          </section>
          <section id="story">
            <h1>story</h1>
            <p>LPL started as a simple prototype. It had two buttons and was very slow. It was discovered by Joerg
              Miedza, a prominent member of the light-painting community. The app was very limited, but Joerg saw it as the next step
              in the evolution of light-painting. He wanted to know if it could be improved, so he emailed the developer, Josh Beckwith.
              Ever since then, Josh and Joerg have been exchanging ideas and improving LPL. </p>
            <div class="person">
              <h3>Joerg Miedza</h3><img src="assets/images/joerg.jpg" />
              <div class="content-block">
                <p>Joerg Miedza has been creating movies and photos using special techniques since the late 90's.
                  He is the co-founder of the german light-art project LAPP-PRO. In this project, the LAPP-Team developed a
                  unique brand of light painting: LightArt Performance Photography, or LAPP for short. The skills Joerg acquired
                  working with motion pictures allowed him to contribute significantly to the performance and artistic aspect of
                  LAPP photography.</p>
                <p>His personal work is at <a class="shiny" href="http://miedza.de" target="_blank">miedza.de</a></p>
                <p>There is also a book of the work: <a class="shiny" href="http://shop.oreilly.com/product/9781933952741.do"
                  target="_blank">Painting With Light</a></p>
                <p>Email: <a class="shiny" href="mailto:joerg@miedza.de" target="_blank">joerg@miedza.de </a></p>
              </div>
            </div>
            <div class="person">
              <h3>Josh Beckwith</h3><img src="assets/images/josh.jpg" />
              <div class="content-block">
                <p>Josh has always been obsessed with science and technology - and as a child, he dreamed of
                  becoming an inventor. Now, he's a senior interactive developer at <a class="shiny" href="https://popul-ar.com"
                    target="_blank">PopulAR.</a></p>
                <p>Email: <a class="shiny" href="mailto:josh@lightpaintlive.com" target="_blank">josh@lightpaintlive.com</a></p>
                <p>Instagram: <a class="shiny" href="https://instagram.com/positlabs" target="_blank">@positlabs</a></p>
              </div>
            </div>
          </section>
        </div>

      </Host>
    );
  }

  $(selector) {
    return this.el.querySelector(selector) as HTMLElement
  }

  $$(selector) {
    return Array.from(this.el.querySelectorAll(selector)) as Array<HTMLElement>
  }
}
/*

    <p>Your OS might try to block the installation. Here are instructions on how to get around that. <a class="shiny" href="http://kb.mit.edu/confluence/display/istcontrib/Allow+application+installations+and+temporarily+disable+Gatekeeper+in+OS+X+10.9+and+up" target="_blank">Mac</a><span>
      - </span><a class="shiny" href="https://www.windowscentral.com/how-fix-app-has-been-blocked-your-protection-windows-10" target="blank">Windows</a></p>

*/