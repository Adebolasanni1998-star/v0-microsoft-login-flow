# Microsoft Login Flow - Complete Project Export

**Project Name:** Microsoft MSAL Sign-In Flow  
**Created:** December 2025  
**Technology Stack:** Next.js 16, React 19, TypeScript, MSAL, Azure AD

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Key Files & Code](#key-files--code)
5. [Installation & Setup](#installation--setup)
6. [Environment Variables](#environment-variables)
7. [Running the Project](#running-the-project)
8. [Deployment](#deployment)

---

## Project Overview

This is a complete Microsoft Azure AD sign-in flow implementation built with Next.js and MSAL (Microsoft Authentication Library). It replicates the design and functionality of login.microsoftonline.com with a two-step authentication process:

1. **Email/Phone/Skype Input** - User enters their Microsoft account identifier
2. **Password Entry** - User enters their password with MSAL authentication

**Key Features:**
- Azure AD/Microsoft Entra ID authentication via MSAL
- Two-step sign-in flow matching Microsoft's design
- Mobile-first responsive design
- Error handling and validation
- Password visibility toggle
- Protected routes for authenticated users
- Session management with localStorage

---

## Architecture

### Component Structure
\`\`\`
app/
├── page.tsx                 # Main sign-in page
├── layout.tsx              # Root layout with MSAL provider
├── protected/
│   └── page.tsx           # Protected page for logged-in users
├── globals.css            # Global styles

components/
├── email-step.tsx         # Email/phone input component
├── password-step.tsx      # Password entry component
└── theme-provider.tsx     # Theme configuration

providers/
└── msal-provider.tsx      # MSAL wrapper component

hooks/
├── use-sign-in-flow.ts    # Sign-in state management
├── use-mobile.ts          # Mobile detection hook
└── use-toast.ts           # Toast notifications

lib/
├── msal-config.ts         # MSAL configuration
└── utils.ts               # Utility functions
\`\`\`

### Authentication Flow
1. User lands on sign-in page (app/page.tsx)
2. Enters email/phone/Skype in EmailStep component
3. Validates input and proceeds to PasswordStep
4. Enters password and clicks "Sign in"
5. MSAL triggers loginPopup() for Azure AD authentication
6. On successful auth, user is redirected to /protected
7. Session is managed via MSAL's localStorage cache

---

## File Structure

Total Files: 87 (including UI components and assets)

**Core Application Files:**
- app/page.tsx
- app/layout.tsx
- app/globals.css
- components/email-step.tsx
- components/password-step.tsx
- providers/msal-provider.tsx
- lib/msal-config.ts
- hooks/use-sign-in-flow.ts
- package.json
- tsconfig.json
- next.config.mjs

**UI Component Library (shadcn/ui):**
- 50+ pre-built UI components
- Full Radix UI integration
- Responsive and accessible

**Assets:**
- Microsoft brand SVG icons
- Favicon images (light/dark mode)
- Placeholder assets

---

## Key Files & Code

### 1. MSAL Configuration (lib/msal-config.ts)

Configures Azure AD authentication with your credentials:

\`\`\`typescript
import { PublicClientApplication } from "@azure/msal-browser"

const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_MSAL_CLIENT_ID || "YOUR_CLIENT_ID",
    authority: \`https://login.microsoftonline.com/\${process.env.NEXT_PUBLIC_MSAL_TENANT_ID || "common"}\`,
    redirectUri:
      process.env.NEXT_PUBLIC_MSAL_REDIRECT_URI || \`\${typeof window !== "undefined" ? window.location.origin : ""}\`,
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
\`\`\`

### 2. Email Step Component (components/email-step.tsx)

Handles email/phone/Skype input with validation:

- Validates email format, phone numbers, and Skype usernames
- Shows contextual error messages
- Mobile-friendly input with large touch targets
- Auto-focus on load for better UX

### 3. Password Step Component (components/password-step.tsx)

Handles password entry and MSAL authentication:

- Password visibility toggle (Eye icon)
- Calls MSAL's loginPopup() on submission
- Handles Azure AD errors gracefully
- Shows loading state during authentication
- Back button to return to email step

### 4. Sign-In Flow Hook (hooks/use-sign-in-flow.ts)

Manages the two-step flow state:

\`\`\`typescript
export function useSignInFlow() {
  const [step, setStep] = useState<"email" | "password">("email")
  const [email, setEmail] = useState("")

  const handleNext = (inputEmail: string) => {
    setEmail(inputEmail)
    setStep("password")
  }

  const handleBackToEmail = () => {
    setStep("email")
  }

  return { step, email, handleNext, handleBackToEmail }
}
\`\`\`

### 5. Layout & MSAL Provider (app/layout.tsx)

Root layout that wraps the app with MSAL provider:

\`\`\`typescript
import MSALProvider from "@/providers/msal-provider"

export const metadata: Metadata = {
  title: "Sign in to your Microsoft account",
  description: "Sign in with your Microsoft account to access your services.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        <MSALProvider>
          {children}
          <Analytics />
        </MSALProvider>
      </body>
    </html>
  )
}
\`\`\`

---

## Installation & Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or pnpm package manager
- Azure AD application registered (for production)

### Step 1: Clone/Extract Project
\`\`\`bash
unzip microsoft-login-flow.zip
cd microsoft-login-flow
\`\`\`

### Step 2: Install Dependencies
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### Step 3: Set Environment Variables
Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_MSAL_CLIENT_ID=your-client-id-here
NEXT_PUBLIC_MSAL_TENANT_ID=your-tenant-id-here
NEXT_PUBLIC_MSAL_REDIRECT_URI=http://localhost:3000
\`\`\`

**For production:**
\`\`\`env
NEXT_PUBLIC_MSAL_CLIENT_ID=your-production-client-id
NEXT_PUBLIC_MSAL_TENANT_ID=your-production-tenant-id
NEXT_PUBLIC_MSAL_REDIRECT_URI=https://yourdomain.com
\`\`\`

### Step 4: Register Azure AD Application (if not done)
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to "App registrations"
3. Click "New registration"
4. Fill in the application name: "Microsoft Login Flow"
5. Set Redirect URI: `http://localhost:3000` (for local dev)
6. Under "API permissions", add Microsoft Graph permissions
7. Copy the Client ID and Tenant ID to `.env.local`

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_MSAL_CLIENT_ID` | Azure AD Application ID | `12345678-1234-1234-1234-123456789012` |
| `NEXT_PUBLIC_MSAL_TENANT_ID` | Azure AD Tenant ID | `common` or `12345678-1234-1234-1234-123456789012` |
| `NEXT_PUBLIC_MSAL_REDIRECT_URI` | Redirect URL after sign-in | `http://localhost:3000` |

---

## Running the Project

### Development Mode
\`\`\`bash
npm run dev
\`\`\`
Opens the app at `http://localhost:3000`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Start Production Server
\`\`\`bash
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

---

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" and select your GitHub repo
4. Add environment variables in Vercel dashboard
5. Click "Deploy"

### Other Platforms (Railway, Render, etc.)
1. Build the project locally: `npm run build`
2. Set environment variables on your hosting platform
3. Deploy with: `npm start`

### Docker Deployment
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

---

## Dependencies

### Core Dependencies
- **next@16.0.7** - React framework
- **react@19.2.0** - UI library
- **@azure/msal-react@3.0.23** - MSAL React wrapper
- **@azure/msal-browser@4.27.0** - MSAL browser library
- **typescript@^5** - Type safety

### UI & Styling
- **tailwindcss@4.1.9** - CSS framework
- **@radix-ui/*** - Accessible UI components
- **lucide-react** - Icon library
- **sonner** - Toast notifications

### Forms & Validation
- **react-hook-form@^7.60.0** - Form management
- **@hookform/resolvers@^3.10.0** - Validation resolver
- **zod@3.25.76** - Schema validation

### Analytics
- **@vercel/analytics@1.3.1** - Usage analytics

---

## Troubleshooting

### Issue: MSAL not initializing
**Solution:** Check that NEXT_PUBLIC_MSAL_CLIENT_ID is set correctly in .env.local

### Issue: "Invalid redirect URI"
**Solution:** Make sure NEXT_PUBLIC_MSAL_REDIRECT_URI matches the URI registered in Azure AD

### Issue: Login popup blocked
**Solution:** Ensure pop-ups are allowed in your browser settings

### Issue: "User cancelled" error
**Solution:** User closed the login popup. This is expected behavior.

---

## Project License
This project is created as an educational example of MSAL integration with Next.js.

---

## Support
For issues or questions:
1. Check Azure AD documentation: https://learn.microsoft.com/azure/active-directory/
2. MSAL React docs: https://github.com/AzureAD/microsoft-authentication-library-for-js
3. Next.js docs: https://nextjs.org/docs

---

**Last Updated:** December 2025  
**Next.js Version:** 16.0.7  
**React Version:** 19.2.0
