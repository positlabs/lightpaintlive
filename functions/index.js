// https://firebase.google.com/docs/functions/write-firebase-functions
const functions = require('firebase-functions')
const express = require('express')
const app = express()
const firebase = require('firebase-admin')
const serviceAccount = require('./service-account.json')
firebase.initializeApp({
  // name: 'lightpaintlive',
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://lightpaintlive.firebaseio.com',
})
const config = functions.config()
// console.log(config)
const db = firebase.database()

// const stripe = require('stripe')(config.stripe.test_secret)
const stripe = require('stripe')(config.stripe.secret)

const getUser = (uid) => {
  return new Promise((resolve, reject) => {
    db.ref(`/user/${uid}`).once('value', (snapshot) => {
      resolve(snapshot.val())
    })
  })
}

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.ref(`/user`).orderByChild('email').equalTo(email).once('value', (snapshot) => {
      const val = snapshot.val()
      if (!val) return resolve(null)
      const key = Object.keys(val)[0]
      // console.log(val[key])
      resolve(val[key])
    })
  })
}

app.use(express.json({}))

app.post('/api/buy', (req, res) => {
  let {token} = req.body.paymentMethodData.tokenizationData
  if (token === 'examplePaymentMethodToken') token = {id: 'tok_mastercard'}
  console.log('/api/buy', req.body)
  // submit payment to stripe
  stripe.charges.create({
    // amount: 100,
    amount: 3000,
    currency: 'usd',
    source: token.id,
    description: 'Mercury Pro',
  }, (err, charge) => {
    if (err) {
      res.status(500).send(err)
      return console.error(err)
    } else {
      console.log(charge)
      // store user info in db
      db.ref(`/user/${req.body.uid}`).update({
        mercury_pro: true,
        email: req.body.email,
        display_name: req.body.displayName,
        photo_url: req.body.photoURL
      })
      console.log('sending response to /api/buy')
      res.send({
        status: 'ok'
      })
    }
  })
})

app.get('/api/user/:uid', (req, res) => {
  console.log('/api/user/:uid', req.params)
  getUser(req.params.uid).then((user) => {
    return res.send({
      user
    })
  }).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
})

app.get('/api/user', (req, res) => {
  console.log('/api/user', req.query.email)
  getUserByEmail(req.query.email).then((user) => {
    return res.send({
      user
    })
  }).catch(err => {
    console.error(err)
    res.status(500).send(err)
  })
})

const { addUser } = require('./admin/index')
app.get('/api/add-user', (req, res) => {
  addUser(db, 'Jiggity Josh', 'josh.beckwith.0@gmail.com')
    .then(result => res.send(result))
    .catch(err => res.send(err))
})

const func = functions.https.onRequest(app)
exports.dev = func
exports.stage = func
exports.prod = func

