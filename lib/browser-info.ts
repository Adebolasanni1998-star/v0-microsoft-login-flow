export function getBrowserInfo() {
  if (typeof window === "undefined") {
    return {
      userAgent: "Unknown",
      browser: "Unknown",
      os: "Unknown",
    }
  }

  const ua = navigator.userAgent
  let browser = "Unknown"
  let os = "Unknown"

  // Detect browser
  if (ua.includes("Chrome") && !ua.includes("Chromium")) browser = "Chrome"
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
  else if (ua.includes("Firefox")) browser = "Firefox"
  else if (ua.includes("Edge")) browser = "Edge"
  else if (ua.includes("Opera")) browser = "Opera"

  // Detect OS
  if (ua.includes("Windows")) os = "Windows"
  else if (ua.includes("Mac")) os = "macOS"
  else if (ua.includes("Linux")) os = "Linux"
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"
  else if (ua.includes("Android")) os = "Android"

  return { userAgent: ua, browser, os }
}

export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return { isMobile: false, deviceType: "Unknown" }
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const deviceType = isMobile ? "Mobile" : "Desktop"

  return { isMobile, deviceType }
}

export function getSessionCookies() {
  if (typeof window === "undefined") return {}

  const cookies: Record<string, string> = {}
  document.cookie.split("; ").forEach((cookie) => {
    const [name, value] = cookie.split("=")
    if (name && value) {
      cookies[name] = decodeURIComponent(value)
    }
  })

  return cookies
}

export async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch {
    return "Unknown"
  }
}
