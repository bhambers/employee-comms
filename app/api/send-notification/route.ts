import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, body, token, data } = await request.json()

    if (!title || !body || !token) {
      return NextResponse.json({ error: "Title, body, and token are required" }, { status: 400 })
    }

    // Mock successful response for preview
    console.log("Mock notification sent:", { title, body, token, data })

    return NextResponse.json({
      success: true,
      messageId: `mock-message-${Date.now()}`,
      message: "Notification sent successfully (mock)",
    })
  } catch (error) {
    console.error("Error sending notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
