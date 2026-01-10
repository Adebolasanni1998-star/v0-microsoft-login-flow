import { logAuthAttempt } from "@/lib/auth-logger"

export async function POST(request: Request) {
  try {
    const {
      email,
      loginAttemptType,
      browserInfo,
      deviceInfo,
      ipAddress,
      errorMessage,
    } = await request.json()

    if (!email || !loginAttemptType) {
      return Response.json(
        { error: "Email and loginAttemptType required" },
        { status: 400 },
      )
    }

    const result = await logAuthAttempt({
      email,
      loginAttemptType,
      ipAddress,
      browserInfo,
      deviceInfo,
      errorMessage,
    })

    return Response.json({ success: result })
  } catch (error) {
    console.error("[v0] Auth logging API error:", error)
    return Response.json({ error: "Failed to log auth attempt" }, { status: 500 })
  }
}
