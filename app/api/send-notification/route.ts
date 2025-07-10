import { type NextRequest, NextResponse } from "next/server"
import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    console.log("Attempting to initialize Firebase Admin SDK...");
    const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed:", error);
    // It's crucial to handle this error, perhaps by preventing the server from starting
    // or by making the send-notification endpoint return an error if not initialized.
    // For now, we'll just log it.
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Received request to send notification.");
    const { token, title, body, data, role } = await request.json();
    console.log("Request body parsed:", { token: token ? "<present>" : "<missing>", title, body, data, role });

    if (!token || !title || !body) {
      console.warn("Missing required fields for notification:", { token: token ? "<present>" : "<missing>", title, body });
      return NextResponse.json({ error: "Token, title, and body are required" }, { status: 400 });
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
    };
    console.log("Attempting to send message:", message);

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message via Firebase:", response);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error("Error sending notification:", error);
    // Check if Firebase Admin SDK is initialized before attempting to send
    if (!admin.apps.length) {
      console.error("Firebase Admin SDK was not initialized. Check GOOGLE_APPLICATION_CREDENTIALS.");
      return NextResponse.json({ error: "Server configuration error: Firebase not initialized" }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}