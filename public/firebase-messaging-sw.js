// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

// Declare Firebase variable
const firebase = self.firebase

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBbMjJT4oH_YmJCy2pIyAwbXRuBGzv29ZI",
  authDomain: "compass-hackathon.firebaseapp.com",
  projectId: "compass-hackathon",
  storageBucket: "compass-hackathon.firebasestorage.app",
  messagingSenderId: "441073228909",
  appId: "1:441073228909:web:ce8eaf05838c49fe753364",
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    tag: "employee-notification",
    requireInteraction: true,
    actions: [
      {
        action: "acknowledge",
        title: "Acknowledge",
      },
      {
        action: "view",
        title: "View Details",
      },
    ],
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event)

  event.notification.close()

  if (event.action === "acknowledge") {
    // Handle acknowledgment
    event.waitUntil(
      fetch("/api/acknowledge-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId: event.notification.tag,
        }),
      }),
    )
  } else {
    // Open the app
    event.waitUntil(clients.openWindow("/"))
  }
})
