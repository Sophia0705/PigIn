import React from 'react';
import { registerServiceWorker } from '../utils/notification';
import { requestNotificationPermission } from '../utils/notification';

const AlertSignup: React.FC = () => {
  // Handle notification signup and service worker registration
  async function handleAllowNotification() {
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');

        // Register the service worker
        registerServiceWorker();

        // Request FCM token (handled inside requestNotificationPermission)
        await requestNotificationPermission();
      } else if (permission === 'denied') {
        console.log('Notification permission denied by the user.');
      } else {
        console.log('Notification permission dismissed.');
      }
    } catch (error) {
      console.error('Error during notification permission request:', error);
    }
  }

  return (
    <div className="alert-signup">
      <h2>Sign up for Alerts</h2>
      <button onClick={handleAllowNotification}>Allow Notifications</button>
    </div>
  );
};

export default AlertSignup;
