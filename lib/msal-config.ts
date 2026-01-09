import { PublicClientApplication } from "@azure/msal-browser"

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID || "YOUR_CLIENT_ID",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_MSAL_TENANT_ID || "common"}`,
    redirectUri:
      process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI || `${typeof window !== "undefined" ? window.location.origin : ""}`,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
}

let msalInstance: PublicClientApplication | null = null

export function getMsalInstance() {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}
