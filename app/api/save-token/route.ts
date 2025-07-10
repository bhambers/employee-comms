import { type NextRequest, NextResponse } from "next/server"

// In a real application, you would save this to a database
const tokens: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    // Save token to database (for now, just store in memory)
    if (!tokens.includes(token)) {
      tokens.push(token)
    }

    console.log("Saved FCM token:", token)

    return NextResponse.json({ success: true, message: "Token saved successfully" })
  } catch (error) {
    console.error("Error saving token:", error)
    return NextResponse.json({ error: "Failed to save token" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ tokens })
}
