import { messaging } from '../notification/settingFCM';
import { getToken } from 'firebase/messaging';

// 서비스워커 등록 함수
export async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register(
      'firebase-messaging-sw.js'
    );
    console.log('Service Worker registered successfully', registration);
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
}

// Function to request notification permission and get the FCM token
export async function getDeviceToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_APP_VAPID_KEY,
    });
    // console.log('Device token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get device token:', error);
  }
}
