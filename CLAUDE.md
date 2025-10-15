# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript frontend application for an AI-powered GitHub automation tool. Users authenticate via Supabase, then submit prompts to generate GitHub pull requests through a backend API. The workflow involves:
1. User submits prompt and repository details
2. Backend generates a plan (via `/api/agents/github/plan`)
3. User reviews and approves/denies the plan
4. If approved, backend applies changes and creates PR (via `/api/agents/github/apply`)

## Tech Stack

- **Build Tool**: Vite (React + SWC)
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind CSS)
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with tailwindcss-animate
- **Form Handling**: React Hook Form with Zod validation

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8080)
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Lint the codebase
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Application Entry Point
- `src/main.tsx` - React root render
- `src/App.tsx` - Sets up QueryClient, TooltipProvider, BrowserRouter, and global route structure

### Routing Structure
Routes are defined in `src/App.tsx`:
- `/` - Landing page (Index)
- `/auth` - Authentication page (login/signup)
- `/dashboard` - Main dashboard (protected route)
- `*` - 404 Not Found page

### Authentication Flow
- `src/hooks/useAuth.tsx` - Custom hook that manages Supabase auth state
- `src/integrations/supabase/client.ts` - Supabase client configuration
- `src/pages/Auth.tsx` - Login/signup form component
- Protected routes redirect to `/auth` if user is not authenticated
- Uses localStorage for session persistence

### Dashboard Workflow (src/pages/Dashboard.tsx)
The dashboard implements a 3-step workflow:
1. **Form Step**: User enters repository details, base branch, PR title, and prompt
2. **Review Step**: AI plan is displayed; user can approve or deny
3. **Complete Step**: Success message after PR creation

Key state management:
- `step: 'form' | 'review' | 'complete'` - Current workflow step
- `planResponse` - Stores the AI-generated plan from backend
- `confirmToken` - Token returned from plan endpoint, used to apply changes

### Backend API Integration
The app expects a backend API with these endpoints:
- `POST /api/agents/github/plan` - Generate AI plan for changes
- `POST /api/agents/github/apply` - Apply approved plan and create PR

Backend URL is configured via `VITE_BACKEND_URL` environment variable (see `.env` file).

### Path Aliases
The project uses `@/` as an alias for `./src/` directory. This is configured in:
- `vite.config.ts` - Vite resolver
- `tsconfig.json` - TypeScript path mapping

### UI Components
All UI components are located in `src/components/ui/` and are built using shadcn/ui conventions:
- Pre-built components from Radix UI
- Styled with Tailwind CSS using class-variance-authority
- Use `src/lib/utils.ts` for the `cn()` utility (clsx + tailwind-merge)

### TypeScript Configuration
- `noImplicitAny: false` - Implicit any is allowed
- `strictNullChecks: false` - Null checking is relaxed
- `noUnusedParameters: false` - Unused parameters are allowed
- `noUnusedLocals: false` - Unused locals are allowed

This is a relatively permissive TypeScript configuration.

## Environment Variables

Create a `.env` file in the root directory with:

```bash
# Supabase configuration (required for auth)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key

# Backend API URL (required for GitHub automation)
VITE_BACKEND_URL=http://localhost:3000/
```

Note: All variables prefixed with `VITE_` are exposed to the browser. Never put secret keys here.

## Lovable Integration

This project was initially created with Lovable (https://lovable.dev). The `lovable-tagger` package is used in development mode to tag components for the Lovable editor. Changes made via Lovable are automatically committed to the repository.

Key files:
- `components.json` - shadcn/ui configuration
- `.env` - Local environment variables (not committed)

## Important Implementation Details

### Dashboard Backend Calls
When making API calls to the backend in `Dashboard.tsx`:
- Always check if `VITE_BACKEND_URL` is defined
- Strip trailing slashes from the backend URL
- Handle both HTTP errors and network failures
- Display user-friendly error messages via toast notifications

### Auth State Management
The `useAuth` hook in `src/hooks/useAuth.tsx`:
- Subscribes to Supabase auth state changes
- Checks for existing sessions on mount
- Returns `{ user, session, loading }` for components to use
- Auth state is automatically synced across tabs via localStorage

### Route Protection Pattern
Protected routes check auth state in `useEffect`:
```typescript
useEffect(() => {
  if (!authLoading && !user) {
    navigate('/auth');
  }
}, [user, authLoading, navigate]);
```

Always show a loading spinner while `authLoading` is true to prevent flash of wrong content.
