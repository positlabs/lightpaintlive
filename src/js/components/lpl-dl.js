
/*

	TODO logout button


*/

import {html} from '@polymer/lit-element'
import {default as ComponentBase} from './component-base'
const componentName = 'lpl-dl'
require(`../../styles/components/${componentName}.scss`)

const FIREBASE_PROJECT_ID = 'lightpaintlive'
const firebase = require('firebase/app')
require('firebase/auth')

// Initialize Firebase
const config = {
    apiKey: 'AIzaSyBbVEyizlMI9fzmw72Qf6jMrRtAPEfqvhE',
    authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
    projectId: FIREBASE_PROJECT_ID,
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
		firebase.initializeApp(config)
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in.
				const {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData} = user
				console.log({displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData})
				// TODO handle user signed in. get user purchase status from db
				this.showUI('buy')
				// this.showUI('download')
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

	download(){
		this.showUI('download')
		// TODO create another release target for v3
		$.get('https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/latest.json', {dataType: 'jsonp'}, (data) => {
			data = JSON.parse(data)
			console.log(data)
			var url
			var isMac = navigator.platform === 'MacIntel'
			var isWin = navigator.platform.indexOf('Win') !== -1
			// isWin = true; isMac = false;
			// isWin = false; isMac = false;
			if(isMac){
				url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'.dmg'
			}else if(isWin){
				url = 'https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/'+data.version+'/lpl-mercury-'+data.version+'+Setup.exe'
			}
			if(url){
				window.location = url
				this.find('#manual-dl').setAttribute('href', url)
			}else {
				alert('Sorry, this platform is not supported. Try again on Mac or Windows.')
			}
		})
	}

	onClickLogin(){
		// console.log('onClickLogin')
		const provider = new firebase.auth.GoogleAuthProvider()
		firebase.auth().signInWithPopup(provider)
		// .then((result) => {
		// 	console.log(result)
		// 	// This gives you a Google Access Token. You can use it to access the Google API.
		// 	var token = result.credential.accessToken
		// 	var user = result.user
		// }).catch((error) => {
		// 	console.error(error)
		// 	var errorCode = error.code
		// 	var errorMessage = error.message
		// 	var email = error.email
		// 	var credential = error.credential
		// })
	}

	render() {
		return html`
			<div class="wrapper">
				<div id="auth-ui" class="ui">
					<h2>Please log in to purchase or access downloads</h2>
					<div id="login-btn" @click=${this.onClickLogin}>
						<span class="icon"></span>
						<span class="buttonText">Login</span>
					</div>
				</div>
				<div id="buy-ui" class="ui">
					purchase, yo
				</div>
				<div id="download-ui" class="ui">
					<h1>Your Mercury download is starting!</h1>
					<p>If it fails, you can <a class="shiny" id="manual-dl">click here</a> to manually start it.</p>
					<p>Your OS might block the installation. Here are instructions on how to get around that. <a class="shiny" href="http://kb.mit.edu/confluence/display/istcontrib/Allow+application+installations+and+temporarily+disable+Gatekeeper+in+OS+X+10.9+and+up">Mac</a><span>
							- </span><a class="shiny" href="https://www.windowscentral.com/how-fix-app-has-been-blocked-your-protection-windows-10">Windows</a></p>
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
	}
}

customElements.define(componentName, LPLDL)
export default LPLDL


	// // check login state
	// firebase.auth().onAuthStateChanged((user) => {
	// 	if (user) {
	// 		// User is signed in.
	// 		const {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData} = user
	// 		console.log({displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData})
	// 	} else {
	// 		// User is signed out.
	// 	}
	// })