"use client"

import type { ReactNode } from "react"
import { MsalProvider } from "@azure/msal-react"
import { getMsalInstance } from "@/lib/msal-config"

interface MSALProviderProps {
  children: ReactNode
}

export default function MSALProviderWrapper({ children }: MSALProviderProps) {
  const instance = getMsalInstance()
  return <MsalProvider instance={instance}>{children}</MsalProvider>
}
