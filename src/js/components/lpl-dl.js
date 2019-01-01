
/*

	TODO
		- logout button
		- test on ssl via localtunnel
		- handle user signed in. get user purchase status from db and show appropriate ui
		- request production access to google pay api
		- create another release target for v3
*/

import {html} from '@polymer/lit-element'
import {default as ComponentBase} from './component-base'
const componentName = 'lpl-dl'
require(`../../styles/components/${componentName}.scss`)
import './google-pay'

// const FIREBASE_PROJECT_ID = 'lightpaintlive'
const firebase = require('firebase/app')
require('firebase/auth')

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyBbVEyizlMI9fzmw72Qf6jMrRtAPEfqvhE',
    // authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    // authDomain: `${FIREBASE_PROJECT_ID}-dev.firebaseapp.com`,
    // projectId: FIREBASE_PROJECT_ID,
	authDomain: "lightpaintlive.firebaseapp.com",
	databaseURL: "https://lightpaintlive.firebaseio.com",
	projectId: "lightpaintlive",
	storageBucket: "lightpaintlive.appspot.com",
	messagingSenderId: "281319827451"
}

class LPLDL extends ComponentBase {
	
	static get properties() {
		return {
			pro: {type: Boolean},
		}
	}
	
	constructor() {
		super()
	}
	
	async showAuth(){
		this.showUI('auth')
		firebase.initializeApp(firebaseConfig)
		// await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in.
				const {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData} = user
				this.user = {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData}
				console.log(this.user)
				// handle user signed in. get user purchase status from db and show appropriate ui
				$.get(`/api/user/${uid}`, (response) => {
					console.log(response)
					if(response.user){
						this.showUI('download')
					}else{
						this.showUI('buy')
					}
				})
			} else {
				// User is signed out.
			}
		})
	}

	showUI(name){
		console.log('showUI', name, this.$(`#${name}-ui`))
		this.$('.ui').css('display', 'none')
		this.$(`#${name}-ui`).css('display', 'block')
	}

	download(type='auto'){
		// this.showUI('download')

		const version = this.pro ? 4 : 3
		const manifest = `https://storage.googleapis.com/lightpaintlive.appspot.com/v${version}-latest.json`
		$.get(manifest, {}, (data) => {
			// data = JSON.parse(data)
			console.log(data)
			var url
			var isMac = navigator.platform === 'MacIntel'
			var isWin = navigator.platform.indexOf('Win') !== -1
			// isWin = true; isMac = false;
			// isWin = false; isMac = false;
			if(type !== 'auto'){
				isMac = type === 'mac'
				isWin = type === 'win'
			}
			const proString = this.pro ? 'pro-' : ''
			if(isMac){
				url = `https://storage.googleapis.com/lightpaintlive.appspot.com/builds/mac/lpl-mercury-${proString}${data.version}.dmg`
				// url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'.dmg'
			}else if(isWin){
				url = `https://storage.googleapis.com/lightpaintlive.appspot.com/builds/win/lpl-mercury-pro-${proString}${data.version}%20Setup.exe`
				// url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'+Setup.exe'
			}
			if(url){
				window.location = url
				// this.find('#manual-dl').setAttribute('href', url)
			// }else {
				// alert('Sorry, this platform is not supported. Try again on Mac or Windows.')
			}
		})
	}

	onClickLogin(){
		const provider = new firebase.auth.GoogleAuthProvider()
		firebase.auth().signInWithPopup(provider)
	}
	onClickLogout(){
		firebase.auth().signOut().then(() => {
			// Sign-out successful.
		}).catch((error) => {
			// An error happened.
		})
	}

	render() {
		return html`
			<div class="wrapper">
				<div id="auth-ui" class="ui">
					<h2>Please log in to purchase or access downloads</h2>
					<div id="login-btn">
						<span class="icon"></span>
						<span class="buttonText">Log in with Google</span>
					</div>
				</div>
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
						<div class='dl-btn' type='mac'><img width='15' src='/assets/images/apple.svg'> MAC INSTALLER</div>
						<div class='dl-btn' type='win'><img width='12' src='/assets/images/windows.svg'> WIN INSTALLER</div>
					</p>
					<p>Your OS might try to block the installation. Here are instructions on how to get around that. <a class="shiny" href="http://kb.mit.edu/confluence/display/istcontrib/Allow+application+installations+and+temporarily+disable+Gatekeeper+in+OS+X+10.9+and+up" target="_blank">Mac</a><span>
							- </span><a class="shiny" href="https://www.windowscentral.com/how-fix-app-has-been-blocked-your-protection-windows-10" target="blank">Windows</a></p>
				</div>
			</div>
		`
	}

	firstUpdated(){
		if(!this.attributes.pro){
			this.download()
		}else{
			this.showAuth()
		}
		this.$('google-pay').on('buy', (e) => this.onBuy(e.detail.token))
		this.$('#login-btn').click(this.onClickLogin.bind(this))
		// this.$('#manual-dl').click(this.download.bind(this))
		this.$('.dl-btn').click((e) => {
			const type = e.currentTarget.getAttribute('type')
			this.download(type)
		})
	}

	onBuy(token){
		const data = {
			token,
			email: this.user.email,
			photoURL: this.user.photoURL,
			displayName: this.user.displayName,
			uid: this.user.uid,
		}
		console.log('onBuy', data)
		$.ajax({
			url: '/api/buy',
			type: 'POST',
			data: JSON.stringify(data),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
		}).done(response => {
			console.log('buy success', response)
			this.showUI('download')
		}).fail((xhr, status, err) => {
			console.error(err)
			// handle error
			alert('payment failed with error: ' + err)
		})
	}
}

customElements.define(componentName, LPLDL)
export default LPLDL
