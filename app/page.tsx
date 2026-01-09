"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMsal } from "@azure/msal-react"
import EmailStep from "@/components/email-step"
import PasswordStep from "@/components/password-step"
import { useSignInFlow } from "@/hooks/use-sign-in-flow"

export default function Home() {
  const router = useRouter()
  const { accounts } = useMsal()
  const { step, email, handleNext, handleBackToEmail } = useSignInFlow()

  useEffect(() => {
    if (accounts.length > 0) {
      router.push("/protected")
    }
  }, [accounts, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      {/* Main sign-in card */}
      <div className="w-full max-w-md">
        {step === "email" ? (
          <EmailStep email={email} onNext={handleNext} />
        ) : (
          <PasswordStep email={email} onBack={handleBackToEmail} />
        )}

        {/* Sign-in options card */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center">
          <button className="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v16.5A2.25 2.25 0 003.75 22.5h16.5a2.25 2.25 0 002.25-2.25V13.5m-18-5.25h5m-5 2.25h3"
              />
            </svg>
            Sign-in options
          </button>
        </div>

        {/* Footer links */}
        <div className="mt-6 text-center text-xs text-gray-600 space-y-3">
          <div className="flex items-center justify-center gap-3">
            <a href="#" className="hover:underline">
              Terms of use
            </a>
            <span>•</span>
            <a href="#" className="hover:underline">
              Privacy & cookies
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
