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
    const { token, title, body, data } = await request.json()

    if (!token || !title || !body) {
      return NextResponse.json({ error: "Token, title, and body are required" }, { status: 400 })
    }

    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      data: data || {},
    }

    const response = await admin.messaging().send(message)
    console.log("Successfully sent message:", response)

    return NextResponse.json({ success: true, messageId: response })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}