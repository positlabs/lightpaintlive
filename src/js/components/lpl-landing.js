/*

    https://github.com/Polymer/lit-element
    https://github.com/Polymer/lit-element#api-documentation

*/
import {
    html
} from '@polymer/lit-element'
import {
    default as ComponentBase
} from './component-base'
const componentName = 'lpl-landing'
require('../../styles/components/lpl-landing.scss')

class LPLLanding extends ComponentBase {

    constructor() {
        super()
        $(window).on('resize', this.onResize.bind(this))
    }

    render() {
        // <iframe class="video" src="//www.youtube.com/embed/jzrUNDacs1A" frameborder="0" allowfullscreen></iframe>

        return html `
        <div class="wrapper">
            <section id="mercury">
                <h1>Mercury</h1>
                <p>A webcam app for light painting in real-time - for Mac &amp; Windows. </p>
                <div class="mercury-btns">
                    <div class="pro-btn btn">
                        <div class="icon"></div><a href="./download-mercury-pro.html">Buy Pro (V4+)</a>
                    </div>
                    <div class="launch-btn btn">
                        <div class="icon"></div><a href="./download-mercury.html">Download V3</a>
                    </div>
                </div>
                <iframe id="ytplayer" type="text/html" src="https://www.youtube.com/embed/jzrUNDacs1A?list=PLAZp2Vi7Gfsouo7T5XA39-M_swalzOs9C&listType=playlist&modestbranding=1" frameborder="0" allowfullscreen></iframe>
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
                        target="_blank">Webcam&nbsp;Settings</a> (Mac).
                    <a class="shiny" href="https://obsproject.com/">OBS</a> also has webcam controls on Windows.</p>

                <h2>How can I force Mercury to use the dedicated GPU card?</h2>
                <h3>Nvidia</h3>
                <p>Open the NVIDIA control panel. Right-click on an empty area on your desktop and select the ‘NVIDIA Control Panel’ option from the context menu.</p>
                <p>Go to the Desktop menu and enable the ‘Add “Run with graphics processor” to Context Menu’ option.</p>
                <p>Add a shortcut to Mercury to the desktop, then right-click and select “Run with graphics processor”.</p>
                <h3>AMD</h3>
                <p>Open the AMD Catalyst Control Center app by right-clicking on an empty area on your desktop. Select ‘Catalyst Control Center’ from the context menu. From the list of panels on the left, select ‘Power’. Under ‘Power’, select ‘Switchable application graphics settings’. Add Mercury to this list.</p>
                <p>Read <a src='https://www.addictivetips.com/windows-tips/force-app-to-use-dedicated-gpu-windows/' target='_blank'>How To Force An App To Use The Dedicated GPU On Windows</a> for a more detailed explanation.</p>

            </section>
            <section id="story">
                <h1>story</h1>
                <p>LPL started as a simple prototype. It had two buttons and was very slow. It was discovered by Joerg
                    Miedza, a prominent member of the light-painting community. The app was very limited, but Joerg saw it
                    as the next step
                    in the evolution of light-painting. He wanted to know if it could be improved, so he emailed the
                    developer, Josh Beckwith.
                    Ever since then, Josh and Joerg have been exchanging ideas and improving LPL. </p>
                <div class="person">
                    <h3>Joerg Miedza</h3><img src="assets/images/joerg.jpg">
                    <div class="content-block">
                        <p>Joerg Miedza has been creating movies and photos using special techniques since the late 90's.
                            He is the co-founder of the german light-art project LAPP-PRO. In this project, the LAPP-Team
                            developed a
                            unique brand of light painting: LightArt Performance Photography, or LAPP for short. The skills
                            Joerg acquired
                            working with motion pictures allowed him to contribute significantly to the performance and
                            artistic aspect of
                            LAPP photography.</p>
                        <p>His personal work is at <a class="shiny" href="http://miedza.de" target="_blank">miedza.de</a></p>
                        <p>There is also a book of the work: <a class="shiny" href="http://shop.oreilly.com/product/9781933952741.do"
                                target="_blank">Painting With Light</a></p>
                        <p>Email: <a class="shiny" href="mailto:joerg@miedza.de" target="_blank">joerg@miedza.de </a></p>
                    </div>
                </div>
                <div class="person">
                    <h3>Josh Beckwith</h3><img src="assets/images/josh.jpg">
                    <div class="content-block">
                        <p>Josh has always been obsessed with science and technology - and as a child, he dreamed of
                            becoming an inventor. Now, he's a senior interactive developer at <a class="shiny" href="http://toolofna.com"
                                target="_blank">Tool of North America.</a></p>
                        <p>Email: <a class="shiny" href="mailto:josh@lightpaintlive.com" target="_blank">josh@lightpaintlive.com</a></p>
                        <p>Instagram: <a class="shiny" href="https://instagram.com/positlabs" target="_blank">@positlabs</a></p>
                    </div>
                </div>
            </section>
        </div>
        `
    }
    firstUpdated() {
        this.$ytIframe = this.$('iframe')
        this.onResize()
    }

    onResize(e) {
        // apply correct aspect ratio to youtube iframe
        this.$ytIframe.css({
            height: this.$ytIframe.width() * 9 / 16
        })
    }
}

customElements.define(componentName, LPLLanding)
export default LPLLanding
