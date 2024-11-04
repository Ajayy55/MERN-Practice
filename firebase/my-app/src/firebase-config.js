
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage ,deleteToken} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  databaseURL: process.env.REACT_APP_databaseURL ,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  vapidKey: process.env.REACT_APP_vapidKey,
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Function to request permission and generate token
export const genToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
   const token=await getToken(messaging, { vapidKey: firebaseConfig.vapidKey })
   console.log(token);
  localStorage.setItem('PushToken',token)
  return token;
    // .then(res=>{
    //   console.log(res);
    //   localStorage.setItem('PushToken',res)
    // })

    // console.log('Token:', token);
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
// Call the message listener setup once
// setupMessageListener();

export async function deleteFCMToken() {
  const messaging = getMessaging();

  try {
      // Get the current token
      const currentToken = await getToken(messaging);
      
      if (currentToken) {
          // Delete the current token
          await deleteToken(messaging);
          console.log('Token deleted successfully.');
      } else {
          console.log('No valid token found to delete.');
      }
  } catch (error) {
      console.error('Error deleting token:', error);
  }
}


