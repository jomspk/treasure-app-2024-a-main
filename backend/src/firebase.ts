import firebase from 'firebase-admin'

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON_BASE64 ?? '', 'base64').toString()
)

const firebaseApp = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
})

export { firebaseApp }
