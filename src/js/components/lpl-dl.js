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
		if(!this.pro){
			this.download()
		}else{
			this.showAuth()
		}
	}

	showAuth(){
		firebase.initializeApp(config)
	}

	download(){
		// TODO show download messaging
		// TODO create another release target for v3
		$.get('https://s3-us-west-2.amazonaws.com/lightpaintlive-mercury/latest.json', {dataType: 'jsonp'}, function(data){
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
				document.querySelector('#manual-dl').setAttribute('href', url)
			}else {
				alert('Sorry, this platform is not supported. Try again on Mac or Windows.')
			}
		})
	}

	render() {
		return html`
			<style>${style}</style>
			<div class="wrapper">
				<div id="auth-ui">
					authorize, yo
				</div>
				<div id="download">
					<h1>Your Mercury download is starting!</h1>
					<p>If it fails, you can <a class="shiny" id="manual-dl">click here</a> to manually start it.</p>
					<p>Your OS might block the installation. Here are instructions on how to get around that. <a class="shiny" href="http://kb.mit.edu/confluence/display/istcontrib/Allow+application+installations+and+temporarily+disable+Gatekeeper+in+OS+X+10.9+and+up">Mac</a><span>
							- </span><a class="shiny" href="https://www.windowscentral.com/how-fix-app-has-been-blocked-your-protection-windows-10">Windows</a></p>
				</div>
			</div>
		`
	}
}

customElements.define(componentName, LPLDL)
export default LPLDL

	// onClickLogin(){
	// 	// console.log('onClickLogin')
	// 	const provider = new firebase.auth.GoogleAuthProvider()
	// 	firebase.auth().signInWithPopup(provider).then((result) => {
	// 		console.log(result)
	// 		// This gives you a Google Access Token. You can use it to access the Google API.
	// 		var token = result.credential.accessToken
	// 		var user = result.user
	// 	}).catch((error) => {
	// 		console.error(error)
	// 		var errorCode = error.code
	// 		var errorMessage = error.message
	// 		var email = error.email
	// 		var credential = error.credential
	// 	})
	// }


	// TODO set login state in model
	// firebase.auth().onAuthStateChanged((user) => {
	// 	if (user) {
	// 		// User is signed in.
	// 		const {displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData} = user
	// 		console.log({displayName, email, emailVerified, photoURL, isAnonymous, uid, providerData})
	// 	} else {
	// 		// User is signed out.
	// 	}
	// })