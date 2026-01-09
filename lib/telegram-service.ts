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
