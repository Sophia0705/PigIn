importScripts(
  'https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js'
);

// Initialize the Firebase app in the service worker by passing in your firebase config
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Optional: you can replace this with your own icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  console.log('fcm sw activate..');
});

self.addEventListener('push', function (e) {
  if (!e.data.json()) return;

  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;

  const notificationOptions = {
    body: resultData.body,
  };

  console.log(resultData.title, {
    body: resultData.body,
  });

  e.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});
