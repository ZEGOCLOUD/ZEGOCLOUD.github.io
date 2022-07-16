// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
// importScripts('/__/firebase/9.2.0/firebase-app-compat.js');
// importScripts('/__/firebase/9.2.0/firebase-messaging-compat.js');
// importScripts('/__/firebase/init.js');

// const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.
 *  **/

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyASiPspPxaPd-cwcLreUJ9JL5REprJd2To",
  authDomain: "easyexample-7c37e.firebaseapp.com",
  projectId: "easyexample-7c37e",
  storageBucket: "easyexample-7c37e.appspot.com",
  messagingSenderId: "17907117774",
  appId: "1:17907117774:web:154c5b5a07a83208d4ea9f",
  measurementId: "G-JK09KKQ2XW",
});
// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
let roomID, body, title;

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  notifyMe(notificationTitle, {
    body: payload.notification.body,
    icon: payload.notification.callerIconUrl,
  });
  roomID = payload.data.callerUserID;
  body = payload.notification.body;
  title = notificationTitle;
});

function notifyMe(title, notification) {
  // Check if the user agrees to receive notifications
  if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    self.registration.showNotification(title, notification);
  }
  // otherwise we need to get permission from the user
  else if (Notification.permission == "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts the permission, we can send a message
      if (permission === "granted") {
        self.registration.showNotification(title, notification);
      }
    });
  }
}

self.addEventListener("notificationclick", function (event) {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(
    clients.openWindow(
      "/call/index.html?roomID=" + roomID + "&body=" + body + "&title=" + title
    )
  );
});
