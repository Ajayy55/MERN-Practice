// src/App.js
import React, { useEffect } from 'react';
import { messaging } from './firebase-config'
import { onMessage } from "firebase/messaging";


const App = () => {
  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
      };

      new Notification(notificationTitle, notificationOptions);
    });
  }, []);

  return (
    <div>
      <h1>Firebase Push Notifications</h1>
    </div>
  );
};

export default App;
