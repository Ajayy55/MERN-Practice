const admin = require("firebase-admin");

const serviceAccount = require("./../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://guardx-26adc-default-rtdb.firebaseio.com"
});

module.exports = admin;
