
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBWOSjroht9qgjFC_eDbZtPPiva8MHAi8Y",
  authDomain: "guardx-26adc.firebaseapp.com",
  databaseURL: "https://guardx-26adc-default-rtdb.firebaseio.com",
  projectId: "guardx-26adc",
  storageBucket: "guardx-26adc.appspot.com",
  messagingSenderId: "1041144258617",
  appId: "1:1041144258617:web:d42eb3d5397540d28d6de8",
  vapidKey: "BDkwYZSKWlI5vyaDGtT3B9V-j_XV4dv-B6yn3YjzePH3OOAlZODp3IoL-mvD-vg8rXqWYBfwJHbzhDLGazCy9ns",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Function to request permission and generate token
export const genToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const token = await getToken(messaging, { vapidKey: firebaseConfig.vapidKey });
    console.log('Token:', token);
  } else {
    console.log('Permission denied');
  }
};

// Function to listen for messages
const setupMessageListener = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received: ', payload);
    // Customize how to show notifications here
    const notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon || 'default_icon.png', // Optional icon
    });
  });
};

// Call the function to request permission and generate token
genToken();

// Call the message listener setup once
setupMessageListener();
