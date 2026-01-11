export async function sendSessionNotificationToTelegram(sessionData: {
  email: string
  browser: string
  device: string
  ipAddress: string
  timestamp: string
  sessionToken?: string
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return false
  }

  try {
    const message = `
📱 *New Session Logged*

👤 *Email:* \`${sessionData.email}\`
🌐 *Browser:* ${sessionData.browser}
💻 *Device:* ${sessionData.device}
🌍 *IP Address:* \`${sessionData.ipAddress}\`
⏰ *Time:* ${sessionData.timestamp}
🔐 *Session Token:* \`${sessionData.sessionToken ? sessionData.sessionToken.substring(0, 20) + "..." : "N/A"}\`
    `.trim()

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send Telegram notification:", await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Telegram service error:", error)
    return false
  }
}

export async function sendAuthAttemptNotificationToTelegram(data: {
  email: string
  attemptType: "success" | "failed"
  browser: string
  device: string
  ipAddress?: string
  errorMessage?: string
  timestamp: string
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return false
  }

  try {
    const emoji = data.attemptType === "success" ? "✅" : "❌"
    const statusText =
      data.attemptType === "success" ? "Successful Login" : "Failed Login Attempt"

    const message = `
${emoji} *${statusText}*

👤 *Email:* \`${data.email}\`
🌐 *Browser:* ${data.browser}
💻 *Device:* ${data.device}
🌍 *IP Address:* \`${data.ipAddress || "Unknown"}\`
⏰ *Time:* ${data.timestamp}
${data.errorMessage ? `⚠️ *Error:* ${data.errorMessage}` : ""}
    `.trim()

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send auth notification:", await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Telegram auth notification error:", error)
    return false
  }
}

export async function sendSuspiciousActivityNotificationToTelegram(data: {
  email: string
  reason: string
  ipAddress?: string
  timestamp: string
  browser?: string
  device?: string
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error("[v0] Telegram credentials not configured")
    return false
  }

  try {
    const message = `
🚨 *SUSPICIOUS ACTIVITY DETECTED*

👤 *Email:* \`${data.email}\`
⚠️ *Reason:* ${data.reason}
🌍 *IP Address:* \`${data.ipAddress || "Unknown"}\`
🌐 *Browser:* ${data.browser || "Unknown"}
💻 *Device:* ${data.device || "Unknown"}
⏰ *Time:* ${data.timestamp}
    `.trim()

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })

    if (!response.ok) {
      console.error("[v0] Failed to send suspicious activity notification:", await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("[v0] Telegram suspicious activity notification error:", error)
    return false
  }
}
