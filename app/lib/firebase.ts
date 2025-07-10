import { initializeApp, getApps } from "firebase/app"
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app
let messaging: any = null

export const initializeFirebase = () => {
  try {
    if (typeof window !== "undefined" && !getApps().length) {
      app = initializeApp(firebaseConfig)
    }
  } catch (error) {
    console.log("Firebase initialization skipped in preview environment")
  }
}

export const requestNotificationPermission = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("Not in browser environment")
      return null
    }

    const supported = await isSupported()
    if (!supported) {
      console.log("Firebase messaging is not supported in this browser")
      return null
    }

    if ("serviceWorker" in navigator) {
      messaging = getMessaging()

      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          })
          console.log("FCM Token:", token)

          // Save the token to your server
          await fetch("/api/save-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          })

          return token
        } catch (tokenError) {
          console.log("Token generation failed (expected in preview):", tokenError)
          return "mock-token-for-preview"
        }
      } else {
        console.log("Notification permission denied")
        return null
      }
    }
  } catch (error) {
    console.log("Notification setup failed (expected in preview):", error)
    return "mock-token-for-preview"
  }
}

export const onMessageListener = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!messaging) {
        console.log("Messaging not initialized, using mock listener")
        // Return a mock promise that never resolves for preview
        return
      }

      onMessage(messaging, (payload) => {
        resolve(payload)
      })
    } catch (error) {
      console.log("Message listener setup failed (expected in preview)")
    }
  })
}
