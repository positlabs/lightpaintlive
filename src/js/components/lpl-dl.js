









// const FIREBASE_PROJECT_ID = 'lightpaintlive'
// const firebase = require('firebase/app')
// require('firebase/auth')

// // Initialize Firebase
// const config = {
//     apiKey: 'AIzaSyBbVEyizlMI9fzmw72Qf6jMrRtAPEfqvhE',
//     authDomain: `${FIREBASE_PROJECT_ID}.firebaseapp.com`,
//     projectId: FIREBASE_PROJECT_ID,
// }
// firebase.initializeApp(config)

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