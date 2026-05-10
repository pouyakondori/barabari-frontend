# AGENT.md — Barabari Frontend

## Project Description

Barabari Frontend is the public-facing web application for a constitutional analysis and comparison platform. Users can explore constitutions, vote on clauses, comment, compare across countries, listen to podcasts, and chat with an AI assistant.

## Quick Start

```bash
npm install
cp .env.example .env.local    # Set NEXT_PUBLIC_GRAPHQL_URL
npm run dev                   # Start at http://localhost:3000
```

## Prerequisites

- Node.js 20+
- Backend API running (barabari-backend at http://localhost:4000)

## Key Technologies

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + shadcn/ui
- Apollo Client 4 (GraphQL)
- react-hook-form + zod (forms & validation)
- next-intl (i18n: Persian + English)

## Project Structure

- `src/app/(main)/` — Public pages (home, countries, podcasts, sandbox, etc.)
- `src/app/(auth)/` — Auth pages (login, signup, forgot-password)
- `src/components/ui/` — shadcn/ui primitives
- `src/components/[domain]/` — Domain-specific components
- `src/graphql/queries/` — GraphQL query documents
- `src/graphql/mutations/` — GraphQL mutation documents
- `src/hooks/` — Custom React hooks
- `src/lib/` — Apollo client, constants, types, utilities
- `src/locale/` — i18n translation files (fa.json, en.json)

## Important Rules

1. **Never push or commit code.** Agents must never run `git commit`, `git push`, or any command that creates commits or pushes to a remote. Leave all version control operations to the developer.
2. Use `@/*` path aliases for all imports (maps to `./src/*`).
3. Default to Server Components; add `"use client"` only when needed.
4. All UI uses Tailwind CSS — no CSS modules or inline styles.
5. RTL-first layout (Persian default): `<html lang="fa" dir="rtl">`.
6. All user-facing strings must go through `useTranslation` hook.
7. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Environment Variables

Key variables in `.env.local`:
- `NEXT_PUBLIC_GRAPHQL_URL` — Backend GraphQL endpoint (default: `http://localhost:4000/graphql`)
- `NEXT_PUBLIC_CHAT_API_URL` — Chat API endpoint (default: `http://localhost:4000/api/chat`)
