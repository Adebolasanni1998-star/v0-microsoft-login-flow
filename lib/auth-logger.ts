import { createServerClient } from "@supabase/ssr"

interface LoginAttemptData {
  email: string
  loginAttemptType: "success" | "failed"
  ipAddress?: string
  browserInfo?: {
    userAgent: string
    browser: string
    os: string
  }
  deviceInfo?: {
    isMobile: boolean
    deviceType: string
  }
  errorMessage?: string
}

async function detectSuspiciousActivity(
  email: string,
  ipAddress: string,
  supabase: any,
): Promise<{ isSuspicious: boolean; reason?: string }> {
  const recentFailures = await supabase
    .from("auth_logs")
    .select("*")
    .eq("email", email)
    .eq("login_attempt_type", "failed")
    .gte("timestamp", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .order("timestamp", { ascending: false })

  if (recentFailures.data && recentFailures.data.length >= 5) {
    return {
      isSuspicious: true,
      reason: "Multiple failed login attempts (5+) in last 30 minutes",
    }
  }

  if (ipAddress) {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const ipUsageByEmail = await supabase
      .from("auth_logs")
      .select("email")
      .eq("ip_address", ipAddress)
      .gte("timestamp", last24Hours)
      .neq("email", email)

    if (ipUsageByEmail.data && ipUsageByEmail.data.length > 0) {
      return {
        isSuspicious: true,
        reason: `IP address used by ${ipUsageByEmail.data.length} other accounts in last 24 hours`,
      }
    }
  }

  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const uniqueIpsCount = await supabase
    .from("auth_logs")
    .select("ip_address", { count: "exact" })
    .eq("email", email)
    .eq("login_attempt_type", "success")
    .gte("timestamp", last7Days)
    .neq("ip_address", ipAddress || "")

  if (uniqueIpsCount.count && uniqueIpsCount.count > 5) {
    return {
      isSuspicious: true,
      reason: `Logins from ${uniqueIpsCount.count + 1} different IPs in last 7 days`,
    }
  }

  return { isSuspicious: false }
}

export async function logAuthAttempt(data: LoginAttemptData): Promise<boolean> {
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

    let suspicious = false
    let suspiciousReason: string | undefined

    if (data.ipAddress) {
      const suspiciousCheck = await detectSuspiciousActivity(
        data.email,
        data.ipAddress,
        supabase,
      )
      suspicious = suspiciousCheck.isSuspicious
      suspiciousReason = suspiciousCheck.reason
    }

    const { error } = await supabase.from("auth_logs").insert({
      email: data.email,
      login_attempt_type: data.loginAttemptType,
      ip_address: data.ipAddress,
      browser_info: data.browserInfo
        ? {
            user_agent: data.browserInfo.userAgent,
            browser: data.browserInfo.browser,
            os: data.browserInfo.os,
          }
        : null,
      device_info: data.deviceInfo
        ? {
            is_mobile: data.deviceInfo.isMobile,
            device_type: data.deviceInfo.deviceType,
          }
        : null,
      error_message: data.errorMessage,
      suspicious_flag: suspicious,
      flagging_reason: suspiciousReason,
    })

    if (error) {
      console.error("[v0] Auth logging error:", error)
      return false
    }

    if (suspicious) {
      console.warn(
        `[v0] Suspicious activity detected for ${data.email}: ${suspiciousReason}`,
      )
    }

    return true
  } catch (error) {
    console.error("[v0] Error logging auth attempt:", error)
    return false
  }
}

export async function getAuthLogs(email: string, limit: number = 20) {
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

    const { data, error } = await supabase
      .from("auth_logs")
      .select("*")
      .eq("email", email)
      .order("timestamp", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Error fetching auth logs:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error getting auth logs:", error)
    return []
  }
}

export async function getSuspiciousActivities(email: string) {
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

    const { data, error } = await supabase
      .from("auth_logs")
      .select("*")
      .eq("email", email)
      .eq("suspicious_flag", true)
      .order("timestamp", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching suspicious activities:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("[v0] Error getting suspicious activities:", error)
    return []
  }
}
