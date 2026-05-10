# Copilot Instructions — Barabari Frontend

## Project Overview

Barabari Frontend is the public-facing web application for a constitutional analysis and comparison platform. Built with Next.js (App Router), it provides constitutional exploration, voting, commenting, comparisons, and AI chat features.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **UI**: React 19, Tailwind CSS 4, shadcn/ui components
- **GraphQL**: Apollo Client 4 (client-side, `cache-and-network` policy)
- **Forms**: react-hook-form + zod validation
- **i18n**: next-intl + custom `useTranslation` hook with `fa.json`/`en.json`
- **Charts**: Recharts
- **Styling**: Tailwind CSS v4, class-variance-authority, clsx, tailwind-merge
- **Lint**: ESLint 9 flat config with eslint-config-next

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout (RTL, Vazirmatn font, ApolloWrapper)
│   ├── globals.css
│   ├── (main)/             # Public pages (home, countries, podcasts, sandbox, etc.)
│   └── (auth)/             # Auth pages (login, signup, forgot-password)
├── components/
│   ├── ui/                 # shadcn/ui primitives (badge, button, card, input)
│   ├── layout/             # Navbar, Footer
│   └── [domain]/           # Domain-specific components (auth, comments, votes, etc.)
├── graphql/
│   ├── queries/            # GraphQL query documents
│   └── mutations/          # GraphQL mutation documents
├── hooks/                  # Custom React hooks (useAuth, useComments, useVote)
├── lib/                    # Apollo client, constants, types, utilities
└── locale/                 # en.json, fa.json, useTranslation hook
```

## Coding Conventions

### Naming
- **PascalCase** for React components and their files
- **camelCase** for hooks, utilities, and variables
- **kebab-case** for route directories under `app/`

### Components
- Use `"use client"` directive only where needed (Apollo, hooks, interactivity)
- Keep Server Components as the default
- Use shadcn/ui primitives from `components/ui/` — do not install alternative UI libraries
- Compose with `cn()` utility from `lib/utils.ts` for conditional class merging

### Routing
- Use Next.js App Router route groups: `(main)` for public pages, `(auth)` for auth pages
- Each page is a `page.tsx` inside its route directory
- Use `layout.tsx` for shared layouts within route groups

### GraphQL
- Queries go in `src/graphql/queries/`
- Mutations go in `src/graphql/mutations/`
- Use Apollo Client hooks (`useQuery`, `useMutation`) in client components
- Apollo Client is configured in `lib/apollo.ts` with `cache-and-network` fetch policy

### Path Aliases
- `@/*` maps to `./src/*` — always use `@/` for imports

### Styling
- Tailwind CSS 4 utility classes — avoid inline styles or CSS modules
- Use `cn()` from `@/lib/utils` for merging conditional classes
- RTL-first layout: `<html lang="fa" dir="rtl">`
- Font: Vazirmatn (Arabic + Latin)

### i18n
- All user-facing strings should use the `useTranslation` hook
- Translations live in `src/locale/fa.json` and `src/locale/en.json`
- Persian (fa) is the default language

### Forms
- Use react-hook-form with zod schemas via `@hookform/resolvers`
- Define zod schemas alongside the form component or in a shared location

### Types
- Manual TypeScript interfaces in `lib/types.ts`
- Keep types co-located or in `lib/types.ts` for shared types

## Code Style

- **Never push or commit code.** Agents must never run `git commit`, `git push`, or any command that creates commits or pushes to a remote. Leave all version control operations to the developer.
- Use `strict` TypeScript settings
- Prefer `async/await` over raw promises
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`)

## Common Commands

```bash
npm run dev      # Start Next.js dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
