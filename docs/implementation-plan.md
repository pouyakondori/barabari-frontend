# Barabari Frontend — Implementation Plan

> **Stack:** Next.js 14 (App Router) · TypeScript · React 18 · Tailwind CSS
> **Goal:** A constitutional analysis & comparison platform for the Iranian public.

---

## 1. Project Bootstrap

| Item | Detail |
|---|---|
| Framework | Next.js 14 with App Router (`/app` directory) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui component library |
| State management | React Context + TanStack Query (server state) |
| GraphQL | Apollo Client + GraphQL Code Generator (typed hooks) |
| Auth | NextAuth.js (credentials + OAuth providers) |
| Forms | React Hook Form + Zod validation |
| i18n | next-intl (RTL/Persian + English) |
| Maps | react-simple-maps (global heatmaps) |
| Charts | Recharts (comparative charts) |
| AI Chat | AI SDK (streaming chatbot UI) — framework-agnostic, works without Vercel |
| Testing | Vitest + React Testing Library + Playwright (e2e) |
| Linting | ESLint + Prettier |
| Versioning | semantic-release + Conventional Commits (commitlint + husky) |

---

## 2. Directory Structure

```
app/
├── (auth)/
│   ├── login/page.tsx                          # /login
│   ├── signup/page.tsx                         # /signup
│   └── forgot-password/page.tsx                # /forgot-password
├── (main)/
│   ├── page.tsx                                # / (Landing)
│   ├── countries/
│   │   └── [country-slug]/
│   │       ├── page.tsx                        # Country Profile Hub
│   │       ├── history/page.tsx                # Country History Timeline
│   │       └── constitution/
│   │           ├── page.tsx                    # Full Constitution Text
│   │           └── clause/
│   │               └── [clause-id]/page.tsx    # Clause Detail View
│   ├── topics/
│   │   └── [topic-slug]/page.tsx               # Topic Comparison Hub
│   ├── tables/
│   │   ├── page.tsx                            # Global Comparison Tables
│   │   └── [table-id]/page.tsx                 # Comparison Table per Topic
│   ├── podcasts/page.tsx                       # Podcast Gallery
│   ├── sandbox/page.tsx                        # Constitution Sandbox/Remix
│   ├── about/page.tsx                          # About Us
│   ├── privacy/page.tsx                        # Privacy Policy
│   └── terms/page.tsx                          # Terms of Service
├── api/
│   ├── auth/[...nextauth]/route.ts             # NextAuth API route
│   ├── chat/route.ts                           # AI chatbot streaming endpoint
│   ├── votes/route.ts                          # Like/Dislike votes
│   └── comments/route.ts                       # User comments
├── layout.tsx                                  # Root layout (RTL, fonts, providers)
└── globals.css
components/
├── ui/                  # shadcn/ui primitives (Button, Card, Dialog…)
├── layout/              # Navbar, Footer, Sidebar, MobileMenu
├── country/             # CountryCard, CountryPreface, ConstitutionViewer…
├── comparison/          # ComparisonTable, HeatMap, TopicCard…
├── auth/                # LoginForm, SignupForm, ForgotPasswordForm
├── comments/            # CommentThread, CommentForm
├── votes/               # VoteButtons (Agree/Disagree with counts)
├── chat/                # AIChatbot, ChatMessage, ChatInput
├── timeline/            # TimelineEvent, TimelineStepper
└── media/               # PodcastPlayer, VideoEmbed
lib/
├── apollo.ts            # Apollo Client instance & cache config
├── auth.ts              # NextAuth config
├── types.ts             # Shared TypeScript interfaces
├── constants.ts         # Topic categories, route constants
└── utils.ts             # Helpers (slug, format, RTL…)
graphql/
├── queries/             # .graphql query documents (countries, clauses, topics…)
├── mutations/           # .graphql mutation documents (vote, comment, auth…)
└── generated/           # Auto-generated types & hooks (GraphQL Code Generator)
hooks/
├── useAuth.ts
├── useVote.ts
├── useComments.ts
└── useCountry.ts
public/
├── locales/             # i18n JSON files (fa, en)
├── images/
└── icons/
```

---

## 3. Implementation Phases

### Phase 1 — Scaffold & Core Layout

- Initialize Next.js 14 project with TypeScript and Tailwind CSS.
- Configure ESLint, Prettier, path aliases (`@/`).
- Set up RTL support and Persian font (Vazirmatn).
- Build root layout with `<Navbar>`, `<Footer>`, and `<MobileMenu>`.
- Create placeholder pages for every route from the route list.
- Set up next-intl with Persian (default) and English.

### Phase 2 — Authentication

- Integrate NextAuth.js with credentials provider (email/password).
- Build `/login`, `/signup`, `/forgot-password` pages with React Hook Form + Zod.
- Implement auth middleware to protect comment/vote actions.
- Add user session context (`useAuth` hook).

### Phase 3 — Landing Page

- Hero section: mission statement, CTA to explore countries.
- Featured countries carousel/grid.
- Quick stats (number of constitutions, clauses analyzed, votes cast) — **fetched from Redis-cached `platformStats` query, not live aggregations**.
- Featured topics preview cards linking to `/topics/[topic-slug]`.
- Latest podcast episode embed.

### Phase 4 — Country Profile Hub (`/countries/[country-slug]`)

- **Preface section:** Country name, flag, population, map coordinates (small interactive map).
- **Constitution Abstract:** Summary card with key facts.
- **Media section:** Embedded podcast player + YouTube video.
- **Infographic:** Visual intro (image or SVG component).
- **Links:** Navigate to sub-pages (History, Full Text).
- **Constitutional Amendments Timeline:** Vertical stepper showing amendment years.
- **Comparison Cards:** Link out to `/tables` with this country pre-selected.
- **Authors section:** Grid of constitution drafters with bios.
- **AI Chatbot:** Floating chat widget (country-scoped context).

### Phase 5 — Country Sub-pages

#### 5a — Country History Timeline (`/countries/[country-slug]/history`)
- Interactive vertical timeline of political events.
- Date of establishment, key regime changes, constitutional milestones.

#### 5b — Full Constitution Text (`/countries/[country-slug]/constitution`)
- Full Persian text rendered with article/clause structure.
- Download as PDF button.
- Each clause is a clickable link → `/countries/[country-slug]/constitution/clause/[clause-id]`.

#### 5c — Clause Detail View (`/countries/[country-slug]/constitution/clause/[clause-id]`)
- Display clause text with context (article, chapter).
- **Vote buttons:** Agree / Disagree with live counts (auth-gated).
- **Comment thread:** Threaded comments (auth-gated to post, public to read). Only admin-approved comments are visible; newly submitted comments show a "pending review" notice to the author.
- Related clauses from other countries (cross-links).

### Phase 6 — Comparative Topics (`/topics/[topic-slug]`)

Build one page per topic category. Categories:

| Category | Topics |
|---|---|
| Fundamental Rights | Freedom of speech, Freedom of religion, Freedom of association, Right to life, Citizenship rights |
| Power & Distribution | Presidential election, Parliament formation, Government formation |
| Rights & Justice | Fair trial, Judiciary operation, Military/police operation |
| Social & Economic | Education, Health, Housing, Labor rights |
| Civic Duties | Voting & elections, Tax law, Citizen responsibilities |
| Constitutional Revision | Amendment procedures |

Each topic page includes:
- Side-by-side country comparison cards.
- Bar/radar charts comparing countries on this topic.
- Link to the relevant global comparison table.

### Phase 7 — Global Comparison Tables (`/tables`, `/tables/[table-id]`)

- `/tables` — Index of all comparison categories with search/filter.
- `/tables/[table-id]` — Per-topic table showing:
  - **Popularity-ranked clauses** (most agreed/disagreed globally) with vote counts.
  - **Interesting facts** callout cards.
  - **Global Heatmap:** World map colored red→green for the topic metric using `react-simple-maps`.

### Phase 8 — Podcast Gallery (`/podcasts`)

- Grid/list of podcast episodes.
- Embedded audio player.
- Filter by country or topic.

### Phase 9 — Constitution Sandbox/Remix (`/sandbox`)

- Interactive tool where users can "build" a constitution by picking clauses from various countries.
- Drag-and-drop or checkbox selection interface.
- Export/share the remix.

### Phase 10 — AI Chatbot Integration

- Streaming chat UI using AI SDK.
- `/api/chat` route that proxies to an LLM with constitutional context.
- Country-scoped mode (when opened from a country page, context = that country's constitution).
- General mode (answers questions across all constitutions).

### Phase 11 — Voting & Comments System

- `/api/votes` — POST to cast Agree/Disagree on a clause; GET to fetch counts.
- `/api/comments` — CRUD for threaded comments on clauses.
- **Comment approval workflow:** Newly submitted comments are in `pending` status and not publicly visible. Only admin-approved comments (`status: "approved"`) are shown to other users. The comment author sees their own pending comments with a "Awaiting approval" badge.
- Optimistic UI updates via TanStack Query mutations.
- Auth guard: unauthenticated users see a "Login to participate" prompt.

### Phase 12 — Semantic Release & Versioning

Automate versioning and changelog generation using **semantic-release** with **Conventional Commits**.

#### Packages

| Package | Purpose |
|---|---|
| `semantic-release` | Automated version management & publishing |
| `@commitlint/cli` | Lint commit messages against Conventional Commits |
| `@commitlint/config-conventional` | Conventional Commits ruleset for commitlint |
| `husky` | Git hooks manager (runs commitlint on `commit-msg`) |
| `@semantic-release/changelog` | Auto-generate `CHANGELOG.md` |
| `@semantic-release/git` | Commit version bumps & changelog back to repo |
| `@semantic-release/github` | Create GitHub releases with release notes |

#### Configuration

- **`.releaserc.json`** — semantic-release config:
  ```json
  {
    "branches": ["main"],
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/npm",
      ["@semantic-release/git", {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [skip ci]"
      }],
      "@semantic-release/github"
    ]
  }
  ```

- **`commitlint.config.js`**:
  ```js
  module.exports = { extends: ['@commitlint/config-conventional'] };
  ```

- **Husky git hooks**:
  ```bash
  npx husky init
  echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
  ```

#### Commit Convention

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

| Prefix | Version Bump | Example |
|---|---|---|
| `fix:` | Patch (`0.0.X`) | `fix: resolve vote count race condition` |
| `feat:` | Minor (`0.X.0`) | `feat: add global heatmap to comparison tables` |
| `feat!:` or `BREAKING CHANGE:` | Major (`X.0.0`) | `feat!: redesign clause voting API` |
| `chore:` | No release | `chore: update dev dependencies` |
| `docs:` | No release | `docs: add API endpoint documentation` |
| `ci:` | No release | `ci: add semantic-release workflow` |

#### CI/CD Integration

Add a GitHub Actions workflow (`.github/workflows/release.yml`):

```yaml
name: Release
on:
  push:
    branches: [main]
permissions:
  contents: write
  issues: write
  pull-requests: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Phase 13 — Static Pages & Polish

- `/about` — About Us page with team info and mission.
- `/privacy` — Privacy Policy (static MDX or rich text).
- `/terms` — Terms of Service (static MDX or rich text).
- SEO: Open Graph tags, dynamic metadata per page.
- Performance: Image optimization, lazy loading, Suspense boundaries.
- Accessibility: ARIA labels, keyboard navigation, RTL testing.
- Mobile responsiveness audit.

---

## 4. Data Models (TypeScript Interfaces)

```typescript
interface Country {
  id: string;
  slug: string;
  name: { fa: string; en: string };
  flag: string;
  population: number;
  coordinates: { lat: number; lng: number };
  abstract: string;
  authors: Author[];
  amendments: Amendment[];
  podcastUrl?: string;
  videoUrl?: string;
}

interface Constitution {
  countryId: string;
  chapters: Chapter[];
  fullTextUrl: string; // PDF download link
}

interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}

interface Article {
  id: string;
  number: number;
  clauses: Clause[];
}

interface Clause {
  id: string;
  number: number;
  text: { fa: string; en: string };
  topicSlugs: string[]; // e.g. ["freedom-of-speech", "citizenship-rights"]
  votes: { agree: number; disagree: number };
}

interface Comment {
  id: string;
  clauseId: string;
  userId: string;
  userName: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  parentId?: string; // for threading
}

interface Topic {
  slug: string;
  name: { fa: string; en: string };
  category: TopicCategory;
  description: string;
}

type TopicCategory =
  | "fundamental-rights"
  | "power-distribution"
  | "rights-justice"
  | "social-economic"
  | "civic-duties"
  | "constitutional-revision";

interface Author {
  name: string;
  bio: string;
  imageUrl?: string;
}

interface Amendment {
  year: number;
  description: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface HeatmapEntry {
  countryCode: string; // ISO 3166-1 alpha-2
  value: number;       // 0–100 scale
}
```

---

## 5. GraphQL Integration (Backend Contract)

The frontend communicates with the backend via a **GraphQL API** (Apollo Server + TypeGraphQL). See `docs/implementation-plan-backend.md` for the full schema.

### Frontend GraphQL Setup

| Item | Detail |
|---|---|
| Client | Apollo Client 3 with `InMemoryCache` |
| Code generation | `@graphql-codegen/cli` with `typescript`, `typescript-operations`, `typescript-react-apollo` plugins |
| Auth header | `Authorization: Bearer <accessToken>` injected via Apollo Link |
| SSR | Apollo Client integrated with Next.js App Router (RSC-compatible) |
| Config file | `codegen.ts` pointing at backend schema URL |

### Key Queries Used by Frontend

| Page | Query / Mutation |
|---|---|
| Landing | `platformStats`, `featuredCountries` |
| Country Profile | `country(slug)`, `constitution(countrySlug)`, `countryTimeline(countrySlug)` |
| Constitution Text | `constitution(countrySlug)` with full nested chapters/articles/clauses |
| Clause Detail | `clause(id)`, `comments(clauseId)`, `relatedClauses(clauseId)`, `myVotes(clauseIds)` |
| Topic Comparison | `topic(slug)`, `clausesByTopic(topicSlug)` |
| Comparison Tables | `comparisonTables`, `comparisonTable(topicSlug)`, `heatmapData(topicSlug)` |
| Podcasts | `podcasts(countrySlug?, topicSlug?)` |
| Sandbox | `mySandboxes`, `createSandbox`, `updateSandbox`, `deleteSandbox` |
| Auth | `login`, `register`, `refreshToken`, `forgotPassword`, `resetPassword`, `me` |
| Voting | `castVote(input)`, `removeVote(clauseId)` |
| Comments | `createComment(input)`, `updateComment`, `deleteComment` |
| AI Chat | REST `POST /api/chat` (SSE streaming — not GraphQL) |

### Apollo Client Configuration

```typescript
// lib/apollo.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // e.g. http://localhost:4000/graphql
});

const authLink = setContext((_, { headers }) => {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : "" },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
```

### GraphQL Code Generator Config

```typescript
// codegen.ts
import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  documents: "graphql/**/*.graphql",
  generates: {
    "graphql/generated/index.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        withComponent: false,
      },
    },
  },
};

export default config;
```

---

## 6. Key Technical Decisions

1. **App Router over Pages Router** — Leverages React Server Components for faster page loads and better SEO for constitution texts.
2. **GraphQL over REST** — Apollo Client + GraphQL Code Generator for type-safe data fetching. The backend uses TypeGraphQL (code-first schema). Only exception: AI chat uses REST/SSE for token streaming.
3. **RTL-first design** — Tailwind's `dir="rtl"` with logical properties (`ps-4` instead of `pl-4`). Persian as the default locale.
4. **Server Components by default** — Only add `"use client"` for interactive components (votes, comments, chat, forms).
5. **Incremental Static Regeneration (ISR)** — Country pages and constitution texts are largely static; revalidate periodically.
6. **Optimistic UI for votes/comments** — Instant feedback via Apollo Client cache updates, reconciled with server response.
7. **Streaming for AI chat** — Uses AI SDK for real-time token streaming (REST endpoint, not GraphQL).

---

## 7. Third-Party Services (To Decide)

| Need | Options |
|---|---|
| Database | MongoDB Atlas (see backend plan) |
| GraphQL Server | Apollo Server 4 + TypeGraphQL (see `implementation-plan-backend.md`) |
| Auth provider | NextAuth.js with database adapter |
| AI/LLM | OpenAI API / Anthropic API via AI SDK |
| File storage | Local backend storage (served via REST endpoints from the backend repo) |
| Hosting | Self-hosted (Docker + Nginx), Railway, Render, Coolify, or Fly.io |
| Analytics | Plausible / PostHog |
| Email (password reset) | Resend / SendGrid |

---

## 8. Non-Functional Requirements

- **Performance:** Lighthouse score ≥ 90 on all pages.
- **Accessibility:** WCAG 2.1 AA compliance; full RTL support.
- **SEO:** Dynamic `<title>` and `<meta>` per page; structured data for articles.
- **Security:** CSRF protection, rate limiting on votes/comments, input sanitization.
- **Mobile:** Fully responsive; touch-friendly vote/comment interactions.
