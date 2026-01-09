"use client"

import type React from "react"
import { useState } from "react"

interface EmailStepProps {
  email: string
  onNext: (email: string) => void
}

export default function EmailStep({ email: initialEmail, onNext }: EmailStepProps) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^\+?[\d\s()-]{10,}$/
    const skypeRegex = /^[a-zA-Z0-9._-]+$/
    return emailRegex.test(value) || phoneRegex.test(value) || skypeRegex.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Enter an email address, phone number, or Skype name.")
      return
    }

    if (!validateEmail(email)) {
      setError("That account doesn't exist. Enter a different account or get a new one.")
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 300))
      onNext(email)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
      <div className="mb-6">
        <svg className="w-8 h-8 mb-6" viewBox="0 0 20 20" fill="none">
          <rect x="0" y="0" width="8" height="8" fill="#F25022" />
          <rect x="11" y="0" width="9" height="8" fill="#7FBA00" />
          <rect x="0" y="11" width="8" height="9" fill="#00A4EF" />
          <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
        </svg>
        <h1 className="text-3xl font-semibold text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-600 mt-2">Email, phone, or Skype</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            placeholder="Email, phone, or Skype"
            className="w-full px-4 py-3 border-b-2 border-gray-300 hover:border-gray-400 focus:border-blue-600 focus:outline-none text-base text-gray-900 placeholder-gray-600 transition-colors text-lg"
            disabled={isLoading}
            autoFocus
          />
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>

        {/* Next Button */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2 px-24 rounded-md transition-colors text-sm"
          >
            {isLoading ? "Signing in..." : "Next"}
          </button>
        </div>
      </form>

      {/* Create account and help links */}
      <div className="mt-8 pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
        <div>
          No account?{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">
            Create one!
          </a>
        </div>
        <div>
          <a href="#" className="text-blue-600 hover:underline">
            Can't access your account?
          </a>
        </div>
      </div>
    </div>
  )
}
