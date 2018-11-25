// https://firebase.google.com/docs/functions/write-firebase-functions
const functions = require('firebase-functions')
const express = require('express')
const app = express()
const firebase = require('firebase-admin')
firebase.initializeApp({
    // apiKey: 'AIzaSyBbVEyizlMI9fzmw72Qf6jMrRtAPEfqvhE',
    // authDomain: 'lightpaintlive.firebaseapp.com',
    databaseURL: 'https://lightpaintlive.firebaseio.com',
})
const config = functions.config()
// console.log(config)
const db = firebase.database()

const stripe = require('stripe')(config.stripe.test_secret)
// const stripe = require('stripe')(config.stripe.secret)

const getUser = (uid) => {
    return new Promise((resolve, reject) => {
        db.ref(`/user/${uid}`).once('value', (snapshot) => {
            resolve(snapshot.val())
        })
    })
}

app.use(express.json({}))

app.post('/api/buy', (req, res) => {
    console.log('/api/buy', req.body)
    // submit payment to stripe
    stripe.charges.create({
        amount: 30000,
        currency: 'usd',
        source: req.body.token,
        // source: "tok_mastercard", // obtained with Stripe.js
        description: 'Mercury Pro'
    }, (err, charge) => {
        if(err) {
            res.status(500).send(err.Error)
            return console.error(err)
        }else {
            console.log(charge)
            // store user info in db
            db.ref(`/user/${req.body.uid}`).update({
                mercury_pro: true,
                email: req.body.email,
                display_name: req.body.displayName,
                photo_url: req.body.photoURL
            })
            res.send('ok')
        }
    })
})

app.get('/api/user/:uid', (req, res) => {
    getUser(req.params.uid).then((user) => {
        return res.send({user})
    }).catch(err => {
        console.error(err)
        res.status(500).send(err)
    })
})

exports.app = functions.https.onRequest(app)