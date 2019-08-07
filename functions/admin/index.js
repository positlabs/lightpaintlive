#!/usr/bin/env node
// const firebase = require('firebase-admin')
// firebase.initializeApp({
//   // apiKey: 'AIzaSyBbVEyizlMI9fzmw72Qf6jMrRtAPEfqvhE',
//   // authDomain: 'lightpaintlive.firebaseapp.com',
//   databaseURL: 'https://lightpaintlive.firebaseio.com',
// })
// const db = firebase.database()

function addUser (db, display_name, email) {
  const ref = `/user/${display_name.replace(' ', '_')}_${Date.now()}`
  console.log(display_name, email, ref)
  return db.ref(ref).update({
    mercury_pro: true,
    email,
    display_name,
  }).then( res => console.log(res)).catch(err => console.error(err))
}

module.exports = {addUser}
