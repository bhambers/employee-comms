import { type NextRequest, NextResponse } from "next/server"
import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { token, title, body, data, role } = await request.json()

    if (!token || !title || !body) {
      return NextResponse.json({ error: "Token, title, and body are required" }, { status: 400 })
    }

    // In a real application, you would fetch FCM tokens based on the 'role' here.
    // For this test, we'll still use the provided 'token'.
    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
    }

    console.log(admin);

    const response = await admin.messaging().send(message)
    console.log("Successfully sent message:", response)

    return NextResponse.json({ success: true, messageId: response })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}