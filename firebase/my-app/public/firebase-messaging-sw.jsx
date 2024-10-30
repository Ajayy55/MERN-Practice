// // public/firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyBWOSjroht9qgjFC_eDbZtPPiva8MHAi8Y",
    authDomain: "guardx-26adc.firebaseapp.com",
    databaseURL: "https://guardx-26adc-default-rtdb.firebaseio.com",
    projectId: "guardx-26adc",
    storageBucket: "guardx-26adc.appspot.com",
    messagingSenderId: "1041144258617",
    appId: "1:1041144258617:web:d42eb3d5397540d28d6de8",
    vapidKey:"BDkwYZSKWlI5vyaDGtT3B9V-j_XV4dv-B6yn3YjzePH3OOAlZODp3IoL-mvD-vg8rXqWYBfwJHbzhDLGazCy9ns",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: './glogo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });

