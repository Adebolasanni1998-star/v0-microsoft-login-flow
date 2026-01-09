"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMsal } from "@azure/msal-react"

export default function ProtectedPage() {
  const router = useRouter()
  const { accounts, inProgress } = useMsal()

  useEffect(() => {
    if (inProgress === "login") {
      return
    }

    if (!accounts.length) {
      router.push("/")
    }
  }, [accounts, inProgress, router])

  if (!accounts.length) {
    return null
  }

  const handleSignOut = async () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-lg shadow-md p-8 border border-border">
          <h1 className="text-3xl font-bold text-card-foreground mb-4">Welcome!</h1>
          <p className="text-muted-foreground mb-6">
            Signed in as: <strong className="text-foreground">{accounts[0]?.username}</strong>
          </p>
          <button
            onClick={handleSignOut}
            className="bg-primary hover:bg-primary text-primary-foreground font-semibold py-2 px-4 rounded transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
