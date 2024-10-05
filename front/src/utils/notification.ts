import { messaging } from '../notification/settingFCM';
import { getToken } from 'firebase/messaging';

// 서비스워커 등록 함수
export function registerServiceWorker() {
  navigator.serviceWorker
    .register('firebase-messaging-sw.js')
    .then(function (registration) {
      console.log('Service Worker registration successful:', registration);
    })
    .catch(function (error) {
      console.log('Service Worker registration failed:', error);
    });
}

// Function to request notification permission and get the FCM token
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Register the service worker
      registerServiceWorker();

      // Get the FCM token
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.VITE_APP_VAPID_KEY, // Use VAPID key from Firebase Console
        serviceWorkerRegistration: await navigator.serviceWorker.ready, // Ensure service worker is ready
      });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Handle the token (send it to your backend, etc.)
      } else {
        console.log(
          'No registration token available. Request permission to generate one.'
        );
      }
    } else {
      console.log('Unable to get permission to notify.');
    }
  } catch (error) {
    console.error('An error occurred while retrieving the token:', error);
  }
}
