# Barabari Backend — Implementation Plan

> **Stack:** Node.js · TypeScript · GraphQL · TypeGraphQL · MongoDB (Mongoose) · Apollo Server
> **Goal:** GraphQL API backend powering the Barabari constitutional analysis platform.

---

## 1. Project Bootstrap

| Item | Detail |
|---|---|
| Runtime | Node.js 24 LTS |
| Language | TypeScript (strict mode) |
| API | GraphQL via Apollo Server 4 |
| Schema | TypeGraphQL (code-first, decorator-based) |
| Database | MongoDB Atlas with Mongoose ODM |
| Auth | JWT (access + refresh tokens) with bcrypt password hashing |
| Validation | class-validator (integrated with TypeGraphQL) |
| File uploads | `multer` middleware — files stored locally under `uploads/` directory in the backend repo |
| Static file serving | Express static middleware serving `uploads/` at `/files/` URL path |
| AI/LLM | OpenAI / Anthropic SDK for chat completions |
| Email | Nodemailer + Resend / SendGrid (password reset, verification) |
| Testing | Vitest + supertest (integration) + mongodb-memory-server |
| Linting | ESLint + Prettier |
| Versioning | semantic-release + Conventional Commits (commitlint + husky) |

---

## 2. Directory Structure

```
src/
├── index.ts                        # Entry point — Apollo Server bootstrap
├── config/
│   ├── env.ts                      # Environment variable validation (envalid)
│   ├── database.ts                 # MongoDB connection
│   └── auth.ts                     # JWT secrets, token expiry config
├── models/                         # Mongoose schemas & models
│   ├── User.ts
│   ├── Country.ts
│   ├── Constitution.ts
│   ├── Chapter.ts
│   ├── Article.ts
│   ├── Clause.ts
│   ├── Vote.ts
│   ├── Comment.ts
│   ├── Topic.ts
│   ├── Podcast.ts
│   ├── TimelineEvent.ts
│   └── Sandbox.ts
├── graphql/
│   ├── types/                      # TypeGraphQL ObjectTypes
│   │   ├── UserType.ts
│   │   ├── CountryType.ts
│   │   ├── ConstitutionType.ts
│   │   ├── ClauseType.ts
│   │   ├── VoteType.ts
│   │   ├── CommentType.ts
│   │   ├── TopicType.ts
│   │   ├── PodcastType.ts
│   │   ├── TimelineEventType.ts
│   │   ├── HeatmapEntryType.ts
│   │   ├── SandboxType.ts
│   │   └── PaginationType.ts
│   ├── inputs/                     # TypeGraphQL InputTypes
│   │   ├── AuthInput.ts
│   │   ├── VoteInput.ts
│   │   ├── CommentInput.ts
│   │   └── SandboxInput.ts
│   ├── resolvers/                  # TypeGraphQL Resolvers
│   │   ├── AuthResolver.ts
│   │   ├── CountryResolver.ts
│   │   ├── ConstitutionResolver.ts
│   │   ├── ClauseResolver.ts
│   │   ├── VoteResolver.ts
│   │   ├── CommentResolver.ts
│   │   ├── TopicResolver.ts
│   │   ├── PodcastResolver.ts
│   │   ├── TimelineResolver.ts
│   │   ├── ComparisonResolver.ts
│   │   ├── ChatResolver.ts
│   │   └── SandboxResolver.ts
│   └── middleware/
│       ├── authChecker.ts          # TypeGraphQL @Authorized() checker
│       └── rateLimiter.ts          # Rate limiting middleware
├── services/                       # Business logic layer
│   ├── AuthService.ts
│   ├── CountryService.ts
│   ├── ConstitutionService.ts
│   ├── VoteService.ts
│   ├── CommentService.ts
│   ├── TopicService.ts
│   ├── ComparisonService.ts
│   ├── ChatService.ts
│   └── EmailService.ts
├── utils/
│   ├── errors.ts                   # Custom GraphQL error classes
│   ├── pagination.ts               # Cursor/offset pagination helpers
│   ├── slugify.ts
│   └── fileUpload.ts               # Multer config, file path helpers
├── routes/
│   └── upload.ts                   # REST routes for file upload (POST /upload)
└── seed/
    ├── countries.json              # Seed data for countries
    ├── constitutions.json          # Seed data for constitution texts
    └── seed.ts                     # Database seeding script
uploads/                                # Local file storage (gitignored, persisted on server)
├── images/                             # Country flags, author photos, podcast covers
├── pdfs/                               # Constitution full-text PDFs
└── audio/                              # Podcast audio files
```

---

## 3. MongoDB Data Models

### User
```typescript
{
  _id: ObjectId,
  email: string,                    // unique, indexed
  passwordHash: string,
  displayName: string,
  role: "user" | "admin",
  isVerified: boolean,
  refreshTokens: string[],
  createdAt: Date,
  updatedAt: Date
}
```

### Country
```typescript
{
  _id: ObjectId,
  slug: string,                     // unique, indexed (e.g. "iran", "germany")
  name: { fa: string, en: string },
  flag: string,                     // URL or emoji
  population: number,
  coordinates: { lat: number, lng: number },
  abstract: { fa: string, en: string },
  authors: [{
    name: string,
    bio: string,
    imageUrl?: string
  }],
  amendments: [{
    year: number,
    description: { fa: string, en: string }
  }],
  podcastUrl?: string,
  videoUrl?: string,
  countryCode: string,              // ISO 3166-1 alpha-2
  createdAt: Date,
  updatedAt: Date
}
```

### Constitution
```typescript
{
  _id: ObjectId,
  countryId: ObjectId,              // ref → Country
  fullTextUrl: string,              // PDF download link
  createdAt: Date,
  updatedAt: Date
}
```

### Chapter
```typescript
{
  _id: ObjectId,
  constitutionId: ObjectId,         // ref → Constitution
  number: number,
  title: { fa: string, en: string },
  order: number                     // sort order
}
```

### Article
```typescript
{
  _id: ObjectId,
  chapterId: ObjectId,              // ref → Chapter
  number: number,
  title?: { fa: string, en: string },
  order: number
}
```

### Clause
```typescript
{
  _id: ObjectId,
  articleId: ObjectId,              // ref → Article
  countryId: ObjectId,              // ref → Country (denormalized for queries)
  number: number,
  text: { fa: string, en: string },
  topicSlugs: string[],            // indexed, e.g. ["freedom-of-speech"]
  agreeCount: number,              // denormalized vote count
  disagreeCount: number,
  order: number
}
```

### Vote
```typescript
{
  _id: ObjectId,
  clauseId: ObjectId,              // ref → Clause, compound index with userId
  userId: ObjectId,                // ref → User
  type: "agree" | "disagree",
  createdAt: Date
}
// Unique compound index: { clauseId, userId } — one vote per user per clause
```

### Comment
```typescript
{
  _id: ObjectId,
  clauseId: ObjectId,              // ref → Clause, indexed
  userId: ObjectId,                // ref → User
  content: string,
  parentId?: ObjectId,             // ref → Comment (threading)
  status: "pending" | "approved" | "rejected",  // admin approval workflow
  isDeleted: boolean,              // soft delete
  createdAt: Date,
  updatedAt: Date
}
// New comments default to status: "pending".
// Only "approved" comments are visible to other users.
// The comment author can see their own "pending" comments.
```

### Topic
```typescript
{
  _id: ObjectId,
  slug: string,                    // unique, indexed
  name: { fa: string, en: string },
  category: string,                // e.g. "fundamental-rights"
  description: { fa: string, en: string },
  order: number
}
```

### TimelineEvent
```typescript
{
  _id: ObjectId,
  countryId: ObjectId,             // ref → Country, indexed
  date: string,                    // ISO date or year string
  title: { fa: string, en: string },
  description: { fa: string, en: string },
  order: number
}
```

### Podcast
```typescript
{
  _id: ObjectId,
  title: { fa: string, en: string },
  description: { fa: string, en: string },
  audioUrl: string,
  coverImageUrl?: string,
  countryId?: ObjectId,            // optional ref → Country
  topicSlug?: string,
  duration: number,                // seconds
  publishedAt: Date,
  createdAt: Date
}
```

### Sandbox (User Constitution Remix)
```typescript
{
  _id: ObjectId,
  userId: ObjectId,                // ref → User
  title: string,
  clauseIds: ObjectId[],           // refs → Clause (selected clauses)
  shareSlug: string,               // unique, for sharing
  createdAt: Date,
  updatedAt: Date
}
```

---

## 4. GraphQL Schema — Queries & Mutations

### Auth

| Operation | Type | Auth | Description |
|---|---|---|---|
| `register(input: RegisterInput!)` | Mutation | No | Create account, send verification email |
| `login(input: LoginInput!)` | Mutation | No | Returns `{ accessToken, refreshToken, user }` |
| `refreshToken(token: String!)` | Mutation | No | Exchange refresh token for new access token |
| `forgotPassword(email: String!)` | Mutation | No | Send password reset email |
| `resetPassword(input: ResetPasswordInput!)` | Mutation | No | Set new password using reset token |
| `me` | Query | Yes | Return current authenticated user |

### Countries

| Operation | Type | Auth | Description |
|---|---|---|---|
| `countries(limit: Int, offset: Int)` | Query | No | List all countries with pagination |
| `country(slug: String!)` | Query | No | Single country by slug (includes authors, amendments) |
| `countryTimeline(countrySlug: String!)` | Query | No | Timeline events for a country |
| `searchCountries(query: String!)` | Query | No | Search countries by name |

### Constitutions & Clauses

| Operation | Type | Auth | Description |
|---|---|---|---|
| `constitution(countrySlug: String!)` | Query | No | Full constitution with nested chapters → articles → clauses |
| `clause(id: ID!)` | Query | No | Single clause with vote counts |
| `clausesByTopic(topicSlug: String!, limit: Int, offset: Int)` | Query | No | All clauses tagged with a topic, across countries |
| `relatedClauses(clauseId: ID!, limit: Int)` | Query | No | Clauses from other countries sharing the same topics |

### Votes

| Operation | Type | Auth | Description |
|---|---|---|---|
| `castVote(input: VoteInput!)` | Mutation | Yes | Cast or update vote on a clause `{ clauseId, type }` |
| `removeVote(clauseId: ID!)` | Mutation | Yes | Remove user's vote from a clause |
| `myVotes(clauseIds: [ID!]!)` | Query | Yes | Batch-fetch current user's votes for given clauses |

### Comments

| Operation | Type | Auth | Description |
|---|---|---|---|
| `comments(clauseId: ID!, limit: Int, offset: Int)` | Query | No | List **approved** comments for a clause (threaded). If authenticated, also includes the current user's pending comments. |
| `createComment(input: CreateCommentInput!)` | Mutation | Yes | Post a comment `{ clauseId, content, parentId? }`. New comments are created with `status: "pending"` and require admin approval before becoming publicly visible. |
| `updateComment(id: ID!, content: String!)` | Mutation | Yes | Edit own comment (resets status to `"pending"` for re-approval) |
| `deleteComment(id: ID!)` | Mutation | Yes | Soft-delete own comment |

### Topics & Comparisons

| Operation | Type | Auth | Description |
|---|---|---|---|
| `topics` | Query | No | List all topics grouped by category |
| `topic(slug: String!)` | Query | No | Topic detail with comparison data across countries |
| `comparisonTable(topicSlug: String!, sortBy: SortBy, limit: Int, offset: Int)` | Query | No | Ranked clauses for a topic by popularity |
| `comparisonTables` | Query | No | List all available comparison table categories |
| `heatmapData(topicSlug: String!)` | Query | No | Array of `{ countryCode, value }` for world map |
| `topicFacts(topicSlug: String!, limit: Int)` | Query | No | Interesting facts for a topic |

### Podcasts

| Operation | Type | Auth | Description |
|---|---|---|---|
| `podcasts(countrySlug: String, topicSlug: String, limit: Int, offset: Int)` | Query | No | List podcasts with optional filters |
| `podcast(id: ID!)` | Query | No | Single podcast detail |

### Sandbox

| Operation | Type | Auth | Description |
|---|---|---|---|
| `mySandboxes` | Query | Yes | List user's saved constitution remixes |
| `sandbox(shareSlug: String!)` | Query | No | View a shared sandbox by slug |
| `createSandbox(input: CreateSandboxInput!)` | Mutation | Yes | Create a new remix `{ title, clauseIds }` |
| `updateSandbox(id: ID!, input: UpdateSandboxInput!)` | Mutation | Yes | Update remix |
| `deleteSandbox(id: ID!)` | Mutation | Yes | Delete remix |

### AI Chat

| Operation | Type | Auth | Description |
|---|---|---|---|
| `chat(message: String!, countrySlug: String)` | Mutation | No | Send message to AI; returns response (non-streaming) |

> **Note:** For streaming chat, a REST endpoint `POST /api/chat` with Server-Sent Events (SSE) is used alongside GraphQL, since GraphQL subscriptions are less suited for LLM token streaming.

### Stats (Landing Page)

| Operation | Type | Auth | Description |
|---|---|---|---|
| `platformStats` | Query | No | `{ totalCountries, totalClauses, totalVotes, totalComments }` |
| `featuredCountries(limit: Int)` | Query | No | Curated list of featured countries |

---

## 5. Implementation Phases

### Phase 1 — Project Scaffold

- Initialize Node.js project with TypeScript (`tsconfig.json` strict mode).
- Set up ESLint, Prettier, path aliases.
- Configure `nodemon` / `tsx` for development hot-reload.
- Set up environment variable validation with `envalid`.
- Initialize MongoDB connection with Mongoose.
- Bootstrap Apollo Server 4 with TypeGraphQL schema.
- Add health-check query.

### Phase 2 — Authentication System

- Implement `User` Mongoose model with password hashing (bcrypt).
- Build `AuthResolver` with register, login, refreshToken, forgotPassword, resetPassword.
- Implement JWT access/refresh token generation and validation.
- Create `authChecker` middleware for TypeGraphQL `@Authorized()` decorator.
- Set up email service (Nodemailer + Resend) for verification and password reset emails.
- Add input validation with class-validator decorators.

### Phase 3 — Country & Constitution Data

- Implement `Country`, `Constitution`, `Chapter`, `Article`, `Clause` Mongoose models.
- Build `CountryResolver` with queries for listing, detail, search.
- Build `ConstitutionResolver` with nested population (chapters → articles → clauses).
- Implement `TimelineEvent` model and `TimelineResolver`.
- Create database seed script with initial country and constitution data.
- Add indexes for slug lookups and topic filtering.

### Phase 4 — Voting System

- Implement `Vote` model with unique compound index `{ clauseId, userId }`.
- Build `VoteResolver` with castVote, removeVote, myVotes.
- Implement denormalized vote count updates on `Clause` (agreeCount, disagreeCount).
- Add rate limiting middleware for vote mutations.

### Phase 5 — Comments System

- Implement `Comment` model with threading (parentId) and `status` field (`pending` | `approved` | `rejected`, default: `pending`).
- Build `CommentResolver` with CRUD operations.
- **Comment approval workflow:** New comments are created with `status: "pending"`. The public `comments` query only returns `approved` comments (plus the current user's own `pending` comments). Editing a comment resets its status to `pending` for re-approval.
- Add ownership validation (users can only edit/delete their own comments).
- Implement soft-delete for comment removal.
- Add pagination (offset-based) for comment listings.

### Phase 6 — Topics & Comparisons

- Implement `Topic` model and `TopicResolver`.
- Build `ComparisonResolver` with:
  - Ranked clause queries (sorted by agree/disagree counts).
  - Heatmap data aggregation (country scores per topic).
  - Interesting facts queries.
- Add `comparisonTable` query with sorting options (most popular, most controversial).

### Phase 7 — Podcasts

- Implement `Podcast` model and `PodcastResolver`.
- Support filtering by country and topic.
- Add pagination.

### Phase 8 — AI Chat Integration

- Build `ChatService` wrapping OpenAI/Anthropic SDK.
- Implement `ChatResolver` for non-streaming GraphQL mutation.
- Add REST endpoint `POST /api/chat` with SSE for streaming responses.
- Implement country-scoped context injection (load constitution text for the given country).
- Add rate limiting for chat requests.

### Phase 9 — Constitution Sandbox

- Implement `Sandbox` model and `SandboxResolver`.
- Build CRUD mutations for user remixes.
- Generate unique share slugs for public sharing.
- Validate clauseIds exist on creation/update.

### Phase 10 — Platform Stats & Landing Data

- Build `StatsResolver` aggregating counts from collections.
- Implement `featuredCountries` query (admin-curated or most-voted).
- Add caching layer (in-memory or Redis) for expensive aggregations.

### Phase 11 — Security & Performance Hardening

- Implement GraphQL query depth limiting (`graphql-depth-limit`).
- Add query complexity analysis (`graphql-query-complexity`).
- Set up rate limiting per IP and per user.
- Input sanitization (XSS prevention) on comments.
- CORS configuration for frontend origin.
- Add request logging (Winston / Pino).
- Implement MongoDB indexes audit for query performance.

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

- **`.releaserc.json`**:
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

#### CI/CD Integration

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

### Phase 13 — Testing & Documentation

- Write unit tests for all services.
- Write integration tests for resolvers using `mongodb-memory-server`.
- Generate GraphQL schema documentation (GraphQL Voyager or SpectaQL).
- Write API usage guide for frontend developers.
- Set up CI pipeline: lint → test → build.

---

## 6. GraphQL Input & Enum Types

```typescript
// --- Inputs ---

@InputType()
class RegisterInput {
  @Field() email: string;
  @Field() password: string;
  @Field() displayName: string;
}

@InputType()
class LoginInput {
  @Field() email: string;
  @Field() password: string;
}

@InputType()
class ResetPasswordInput {
  @Field() token: string;
  @Field() newPassword: string;
}

@InputType()
class VoteInput {
  @Field(() => ID) clauseId: string;
  @Field(() => VoteType) type: "agree" | "disagree";
}

@InputType()
class CreateCommentInput {
  @Field(() => ID) clauseId: string;
  @Field() content: string;
  @Field(() => ID, { nullable: true }) parentId?: string;
}

@InputType()
class CreateSandboxInput {
  @Field() title: string;
  @Field(() => [ID]) clauseIds: string[];
}

@InputType()
class UpdateSandboxInput {
  @Field({ nullable: true }) title?: string;
  @Field(() => [ID], { nullable: true }) clauseIds?: string[];
}

// --- Enums ---

enum VoteType { AGREE = "agree", DISAGREE = "disagree" }

enum TopicCategory {
  FUNDAMENTAL_RIGHTS = "fundamental-rights",
  POWER_DISTRIBUTION = "power-distribution",
  RIGHTS_JUSTICE = "rights-justice",
  SOCIAL_ECONOMIC = "social-economic",
  CIVIC_DUTIES = "civic-duties",
  CONSTITUTIONAL_REVISION = "constitutional-revision"
}

enum SortBy { MOST_AGREED, MOST_DISAGREED, MOST_CONTROVERSIAL, NEWEST }

enum UserRole { USER = "user", ADMIN = "admin" }
```

---

## 7. Key Technical Decisions

1. **TypeGraphQL (code-first)** — Decorators on TypeScript classes generate the GraphQL schema. Single source of truth for types, validation, and resolvers.
2. **Denormalized vote counts** — `agreeCount`/`disagreeCount` stored on `Clause` to avoid expensive aggregations on every read. Updated atomically with `$inc`.
3. **Comment approval workflow** — New comments default to `pending` status. Only admin-approved comments are publicly visible. Editing a comment resets it to `pending`. Soft-delete preserves thread integrity; deleted comments show as "[removed]" in the UI.
4. **Local file storage** — All uploaded assets (images, PDFs, audio) are stored in the `uploads/` directory on the backend server, organized by type (`uploads/images/`, `uploads/pdfs/`, `uploads/audio/`). Files are served via Express static middleware at `/files/`. No external cloud storage (S3, R2, GCS) is used.
5. **JWT with refresh tokens** — Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) stored in DB for revocation.
6. **REST for streaming chat** — GraphQL handles all structured data; SSE endpoint handles real-time LLM token streaming.
7. **Mongoose over raw MongoDB driver** — Schema validation, middleware hooks, population, and TypeScript integration.
8. **Service layer pattern** — Resolvers delegate to services; services contain business logic and interact with models. Keeps resolvers thin and testable.

---

## 8. Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://...

# JWT
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI/LLM
OPENAI_API_KEY=...

# Email
EMAIL_FROM=noreply@barabari.org
RESEND_API_KEY=...

# Frontend
CORS_ORIGIN=http://localhost:3000

# File Storage (local)
UPLOADS_DIR=./uploads                # Local directory for uploaded files
MAX_FILE_SIZE_MB=50                  # Max upload size in MB
```

---

## 9. Non-Functional Requirements

- **Performance:** Query response time < 200ms for standard queries; pagination on all list endpoints.
- **Security:** Query depth limit (10), query complexity limit (1000), rate limiting (100 req/min per IP), input sanitization.
- **Scalability:** Stateless server; horizontal scaling behind a load balancer; MongoDB replica set.
- **Monitoring:** Structured logging (Pino), Apollo Server plugins for query tracing.
- **Deployment:** Docker container; deployable to Railway / Render / AWS ECS / Fly.io.
