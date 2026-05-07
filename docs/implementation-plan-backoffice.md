# Barabari Backoffice — Implementation Plan

> **Stack:** Vite · React 18 · TypeScript · Apollo Client · GraphQL Code Generator · Ant Design
> **Goal:** Admin panel for managing all Barabari platform content, users, and moderation.

---

## 1. Project Bootstrap

| Item | Detail |
|---|---|
| Bundler | Vite 5 |
| Framework | React 18 (SPA) |
| Language | TypeScript (strict mode) |
| UI Library | Ant Design 5 (admin-optimized components: tables, forms, modals, stats) |
| GraphQL Client | Apollo Client 3 |
| Code Generation | `@graphql-codegen/cli` with `typescript`, `typescript-operations`, `typescript-react-apollo` |
| Routing | React Router 6 |
| Forms | Ant Design Form + Zod validation |
| Rich Text Editor | TipTap or React Quill (for bilingual content editing) |
| File Upload | Ant Design Upload → backend REST endpoint (`POST /upload`), files stored locally on backend |
| State | Apollo Client cache + React Context (auth, UI) |
| Charts | Recharts (dashboard analytics) |
| Testing | Vitest + React Testing Library |
| Linting | ESLint + Prettier |
| Versioning | semantic-release + Conventional Commits (commitlint + husky) |

---

## 2. Directory Structure

```
src/
├── main.tsx                             # Entry point
├── App.tsx                              # Router + providers
├── config/
│   └── env.ts                           # Environment variables
├── graphql/
│   ├── queries/                         # .graphql query documents
│   │   ├── dashboard.graphql
│   │   ├── users.graphql
│   │   ├── countries.graphql
│   │   ├── constitutions.graphql
│   │   ├── clauses.graphql
│   │   ├── topics.graphql
│   │   ├── comments.graphql
│   │   ├── votes.graphql
│   │   ├── podcasts.graphql
│   │   ├── sandboxes.graphql
│   │   └── auditLogs.graphql
│   ├── mutations/                       # .graphql mutation documents
│   │   ├── users.graphql
│   │   ├── countries.graphql
│   │   ├── constitutions.graphql
│   │   ├── clauses.graphql
│   │   ├── topics.graphql
│   │   ├── comments.graphql
│   │   ├── podcasts.graphql
│   │   └── settings.graphql
│   └── generated/                       # Auto-generated types & hooks
│       └── index.ts
├── apollo/
│   └── client.ts                        # Apollo Client instance
├── auth/
│   ├── AuthProvider.tsx                 # Auth context (JWT tokens, admin user)
│   ├── ProtectedRoute.tsx               # Route guard (admin only)
│   └── useAuth.ts
├── layouts/
│   ├── AdminLayout.tsx                  # Sidebar + header + content shell
│   └── AuthLayout.tsx                   # Minimal layout for login page
├── pages/
│   ├── Login.tsx                        # Admin login
│   ├── Dashboard.tsx                    # Overview & analytics
│   ├── users/
│   │   ├── UserList.tsx
│   │   └── UserDetail.tsx
│   ├── countries/
│   │   ├── CountryList.tsx
│   │   ├── CountryForm.tsx              # Create/Edit
│   │   └── CountryDetail.tsx
│   ├── constitutions/
│   │   ├── ConstitutionList.tsx
│   │   ├── ConstitutionForm.tsx
│   │   ├── ChapterForm.tsx
│   │   ├── ArticleForm.tsx
│   │   └── ClauseForm.tsx
│   ├── topics/
│   │   ├── TopicList.tsx
│   │   └── TopicForm.tsx
│   ├── comments/
│   │   └── CommentModeration.tsx
│   ├── votes/
│   │   └── VoteAnalytics.tsx
│   ├── podcasts/
│   │   ├── PodcastList.tsx
│   │   └── PodcastForm.tsx
│   ├── timeline/
│   │   ├── TimelineList.tsx
│   │   └── TimelineForm.tsx
│   ├── sandboxes/
│   │   └── SandboxList.tsx
│   ├── settings/
│   │   ├── GeneralSettings.tsx
│   │   └── FeaturedContent.tsx
│   └── audit/
│       └── AuditLog.tsx
├── components/
│   ├── common/
│   │   ├── BilingualInput.tsx           # Dual fa/en text fields
│   │   ├── SlugInput.tsx                # Auto-generated slug field
│   │   ├── ImageUpload.tsx              # S3/R2 upload with preview
│   │   ├── FileUpload.tsx               # PDF upload (constitutions)
│   │   ├── ConfirmModal.tsx
│   │   ├── StatusBadge.tsx
│   │   └── DataTable.tsx               # Wrapper around Ant Design Table
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── VoteChart.tsx
│   │   └── UserGrowthChart.tsx
│   └── constitution/
│       ├── ChapterTree.tsx              # Tree view for chapter → article → clause
│       ├── ClauseEditor.tsx             # Rich text editor for clause content
│       └── TopicTagSelect.tsx           # Multi-select for assigning topics
├── hooks/
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useNotification.ts
├── utils/
│   ├── formatters.ts                    # Date, number formatters
│   ├── validators.ts                    # Zod schemas
│   └── constants.ts                     # Route paths, role enums
└── types/
    └── index.ts                         # Shared app-level types
```

---

## 3. Page-by-Page Feature Breakdown

### 3.1 Login (`/login`)

- Admin-only login form (email + password).
- Calls `login` mutation; stores JWT tokens.
- Redirects to dashboard on success.
- Backend must validate `role === "admin"`.

### 3.2 Dashboard (`/`)

| Widget | Data Source | Description |
|---|---|---|
| Total Users | `adminStats` | Count + growth trend |
| Total Countries | `adminStats` | Number of countries in platform |
| Total Votes | `adminStats` | Aggregate vote count |
| Total Comments | `adminStats` | Aggregate comment count |
| Pending Comments | `adminPendingCommentCount` | **Comments awaiting approval (highlighted)** |
| User Growth Chart | `userGrowthData` | Line chart (daily/weekly/monthly signups) |
| Vote Activity Chart | `voteActivityData` | Bar chart (votes per day) |
| Recent Comments | `recentComments` | Last 10 comments (with approve/reject quick-actions) |
| Recent Signups | `recentUsers` | Last 10 registered users |

### 3.3 User Management (`/users`)

| Feature | Detail |
|---|---|
| List | Paginated table with search by email/name, filter by role/status |
| View | User profile, activity summary (votes, comments, sandboxes) |
| Actions | Change role (user ↔ admin), verify/unverify, ban/unban, delete |
| Bulk actions | Ban or delete multiple selected users |

**GraphQL Operations:**
- `adminUsers(search, role, status, limit, offset)` — Query
- `adminUpdateUser(id, input)` — Mutation
- `adminDeleteUser(id)` — Mutation
- `adminBanUser(id)` — Mutation

### 3.4 Country Management (`/countries`)

| Feature | Detail |
|---|---|
| List | Sortable table with all countries, search by name |
| Create/Edit | Form with bilingual inputs (fa/en) for name, abstract |
| Fields | Name, slug, flag, population, coordinates, countryCode, podcastUrl, videoUrl |
| Authors | Inline repeater to add/remove/reorder authors (name, bio, image) |
| Amendments | Inline repeater to add/remove amendments (year, description) |
| Delete | Soft-delete with confirmation (cascades warning) |

**GraphQL Operations:**
- `adminCountries(search, limit, offset)` — Query
- `adminCreateCountry(input)` — Mutation
- `adminUpdateCountry(id, input)` — Mutation
- `adminDeleteCountry(id)` — Mutation

### 3.5 Constitution Management (`/constitutions`)

This is the core content management area. Constitutions are structured hierarchically: **Constitution → Chapters → Articles → Clauses**.

| Feature | Detail |
|---|---|
| List | Table of constitutions grouped by country |
| Create | Select country, upload PDF, then build structure |
| Tree View | Interactive tree showing Chapters → Articles → Clauses with drag-to-reorder |
| Chapter CRUD | Create/edit/delete chapters (number, bilingual title, order) |
| Article CRUD | Create/edit/delete articles within a chapter (number, title, order) |
| Clause CRUD | Create/edit/delete clauses within an article (number, bilingual text, topic tags, order) |
| Topic Tagging | Multi-select tag picker to assign topics to each clause |
| Bulk Import | Upload structured JSON/CSV to import an entire constitution at once |
| PDF Upload | Upload/replace the downloadable full-text PDF |

**GraphQL Operations:**
- `adminConstitutions(countrySlug)` — Query
- `adminCreateConstitution(input)` — Mutation
- `adminUpdateConstitution(id, input)` — Mutation
- `adminDeleteConstitution(id)` — Mutation
- `adminCreateChapter(input)` / `adminUpdateChapter` / `adminDeleteChapter` — Mutations
- `adminCreateArticle(input)` / `adminUpdateArticle` / `adminDeleteArticle` — Mutations
- `adminCreateClause(input)` / `adminUpdateClause` / `adminDeleteClause` — Mutations
- `adminBulkImportConstitution(countryId, data)` — Mutation
- `adminReorderItems(type, ids)` — Mutation (reorder chapters/articles/clauses)

### 3.6 Topic Management (`/topics`)

| Feature | Detail |
|---|---|
| List | Table grouped by category, sortable by order |
| Create/Edit | Bilingual name & description, category select, display order |
| Clause Count | Show how many clauses are tagged with each topic |
| Delete | With warning if clauses are referencing this topic |

**GraphQL Operations:**
- `adminTopics` — Query
- `adminCreateTopic(input)` / `adminUpdateTopic` / `adminDeleteTopic` — Mutations

### 3.7 Comment Moderation (`/comments`)

| Feature | Detail |
|---|---|
| Approval Queue | **Primary view:** All `pending` comments awaiting admin approval, sorted newest first |
| List | All comments with filters: clause, user, date range, status (`pending`/`approved`/`rejected`/`deleted`) |
| View | Comment content with thread context and clause reference |
| Actions | **Approve**, **reject**, delete (soft), restore |
| Bulk moderation | Select multiple → bulk approve, bulk reject, bulk delete |
| Quick approve | One-click approve button directly in the table row |
| Notification badge | Sidebar badge showing count of pending comments |

**GraphQL Operations:**
- `adminComments(clauseId, userId, status, search, limit, offset)` — Query
- `adminApproveComment(id)` — Mutation
- `adminRejectComment(id)` — Mutation
- `adminBulkApproveComments(ids)` — Mutation
- `adminBulkRejectComments(ids)` — Mutation
- `adminDeleteComment(id)` — Mutation
- `adminRestoreComment(id)` — Mutation
- `adminBulkDeleteComments(ids)` — Mutation
- `adminPendingCommentCount` — Query (for sidebar badge)

### 3.8 Vote Analytics (`/votes`)

| Feature | Detail |
|---|---|
| Overview | Total votes, agree vs disagree ratio, votes over time chart |
| Per-clause breakdown | Table of clauses sorted by total votes / controversy score |
| Per-country breakdown | Which countries' clauses receive most engagement |
| Per-topic breakdown | Which topics generate most votes |
| Export | CSV export of vote data |

**GraphQL Operations:**
- `adminVoteStats(groupBy, dateRange)` — Query
- `adminClauseVoteRankings(sortBy, limit, offset)` — Query
- `adminExportVotes(format)` — Query (returns download URL)

### 3.9 Podcast Management (`/podcasts`)

| Feature | Detail |
|---|---|
| List | Table with title, country, topic, duration, published date |
| Create/Edit | Bilingual title & description, audio file upload, cover image, link to country/topic, duration, publish date |
| Delete | With confirmation |

**GraphQL Operations:**
- `adminPodcasts(search, countryId, topicSlug, limit, offset)` — Query
- `adminCreatePodcast(input)` / `adminUpdatePodcast` / `adminDeletePodcast` — Mutations

### 3.10 Timeline Management (`/timeline`)

| Feature | Detail |
|---|---|
| List | Filtered by country, sorted by date |
| Create/Edit | Bilingual title & description, date, country select, display order |
| Delete | With confirmation |

**GraphQL Operations:**
- `adminTimelineEvents(countrySlug, limit, offset)` — Query
- `adminCreateTimelineEvent(input)` / `adminUpdateTimelineEvent` / `adminDeleteTimelineEvent` — Mutations

### 3.11 Sandbox Oversight (`/sandboxes`)

| Feature | Detail |
|---|---|
| List | All user-created constitution remixes |
| View | Remix contents (which clauses from which countries) |
| Actions | Delete inappropriate remixes |

**GraphQL Operations:**
- `adminSandboxes(userId, search, limit, offset)` — Query
- `adminDeleteSandbox(id)` — Mutation

### 3.12 Featured Content Management (`/settings/featured`)

| Feature | Detail |
|---|---|
| Featured Countries | Select/reorder which countries appear on the landing page |
| Featured Topics | Select/reorder which topics are highlighted |
| Interesting Facts | CRUD for "interesting facts" shown on comparison table pages |
| Heatmap Scores | Manually set or override heatmap scores per country per topic |

**GraphQL Operations:**
- `adminFeaturedCountries` / `adminSetFeaturedCountries(ids)` — Query / Mutation
- `adminFeaturedTopics` / `adminSetFeaturedTopics(slugs)` — Query / Mutation
- `adminFacts(topicSlug)` / `adminCreateFact` / `adminUpdateFact` / `adminDeleteFact` — Query / Mutations
- `adminHeatmapScores(topicSlug)` / `adminSetHeatmapScore(input)` — Query / Mutation

### 3.13 General Settings (`/settings`)

| Feature | Detail |
|---|---|
| Site metadata | Platform name, description, social links |
| Static pages | Edit About Us, Privacy Policy, Terms of Service content (rich text) |
| AI Chat config | Set system prompt, model selection, rate limits |
| Maintenance mode | Toggle site-wide maintenance banner |

**GraphQL Operations:**
- `adminSettings` / `adminUpdateSettings(input)` — Query / Mutation
- `adminStaticPage(slug)` / `adminUpdateStaticPage(slug, content)` — Query / Mutation

### 3.14 Audit Log (`/audit`)

| Feature | Detail |
|---|---|
| Log | Chronological feed of all admin actions (who did what, when) |
| Filters | By admin user, action type, entity type, date range |
| Detail | Expandable row showing before/after diff for edits |

**GraphQL Operations:**
- `adminAuditLogs(adminId, action, entityType, dateRange, limit, offset)` — Query

---

## 4. Admin-Specific GraphQL Operations (Backend Additions)

The following queries and mutations must be added to the backend to support the backoffice. All require `@Authorized("admin")`.

### Queries

| Operation | Description |
|---|---|
| `adminStats` | Dashboard aggregate stats (users, countries, votes, comments) |
| `adminUserGrowth(period: Period!)` | User signups grouped by day/week/month |
| `adminVoteActivity(period: Period!)` | Votes grouped by day/week/month |
| `adminUsers(search, role, status, limit, offset)` | Paginated user list with filters |
| `adminUser(id: ID!)` | Single user with activity summary |
| `adminCountries(search, limit, offset)` | Admin country list |
| `adminConstitutions(countrySlug)` | Constitutions with full nested structure |
| `adminTopics` | All topics with clause counts |
| `adminComments(clauseId, userId, status, search, limit, offset)` | Comments with moderation filters (status: pending/approved/rejected/deleted) |
| `adminPendingCommentCount` | Count of comments awaiting approval (for sidebar badge) |
| `adminVoteStats(groupBy, dateRange)` | Vote analytics data |
| `adminClauseVoteRankings(sortBy, limit, offset)` | Clause rankings by vote metrics |
| `adminPodcasts(search, countryId, topicSlug, limit, offset)` | Podcast list |
| `adminTimelineEvents(countrySlug, limit, offset)` | Timeline events |
| `adminSandboxes(userId, search, limit, offset)` | User sandbox list |
| `adminFeaturedCountries` | Current featured countries |
| `adminFeaturedTopics` | Current featured topics |
| `adminFacts(topicSlug)` | Interesting facts for a topic |
| `adminHeatmapScores(topicSlug)` | Heatmap override scores |
| `adminSettings` | Platform settings |
| `adminStaticPage(slug)` | Static page content |
| `adminAuditLogs(adminId, action, entityType, dateRange, limit, offset)` | Audit trail |

### Mutations

| Operation | Description |
|---|---|
| `adminUpdateUser(id, input)` | Update user role, status |
| `adminDeleteUser(id)` | Delete user account |
| `adminBanUser(id)` / `adminUnbanUser(id)` | Ban/unban user |
| `adminCreateCountry(input)` / `adminUpdateCountry` / `adminDeleteCountry` | Country CRUD |
| `adminCreateConstitution(input)` / `adminUpdateConstitution` / `adminDeleteConstitution` | Constitution CRUD |
| `adminCreateChapter` / `adminUpdateChapter` / `adminDeleteChapter` | Chapter CRUD |
| `adminCreateArticle` / `adminUpdateArticle` / `adminDeleteArticle` | Article CRUD |
| `adminCreateClause` / `adminUpdateClause` / `adminDeleteClause` | Clause CRUD |
| `adminBulkImportConstitution(countryId, data)` | Bulk import chapters/articles/clauses |
| `adminReorderItems(type, ids)` | Reorder chapters, articles, or clauses |
| `adminCreateTopic` / `adminUpdateTopic` / `adminDeleteTopic` | Topic CRUD |
| `adminApproveComment(id)` / `adminRejectComment(id)` | Approve or reject a pending comment |
| `adminBulkApproveComments(ids)` / `adminBulkRejectComments(ids)` | Bulk approve/reject |
| `adminDeleteComment(id)` / `adminRestoreComment(id)` | Comment soft-delete/restore |
| `adminBulkDeleteComments(ids)` | Bulk comment deletion |
| `adminCreatePodcast` / `adminUpdatePodcast` / `adminDeletePodcast` | Podcast CRUD |
| `adminCreateTimelineEvent` / `adminUpdateTimelineEvent` / `adminDeleteTimelineEvent` | Timeline CRUD |
| `adminDeleteSandbox(id)` | Delete user sandbox |
| `adminSetFeaturedCountries(ids)` / `adminSetFeaturedTopics(slugs)` | Set featured content |
| `adminCreateFact` / `adminUpdateFact` / `adminDeleteFact` | Interesting facts CRUD |
| `adminSetHeatmapScore(input)` | Set/override heatmap score |
| `adminUpdateSettings(input)` | Update platform settings |
| `adminUpdateStaticPage(slug, content)` | Update static page content |

---

## 5. Implementation Phases

### Phase 1 — Project Scaffold

- Initialize Vite + React + TypeScript project.
- Install and configure Ant Design 5 with RTL support.
- Set up ESLint, Prettier, path aliases (`@/`).
- Configure Apollo Client with auth link (JWT from localStorage).
- Set up GraphQL Code Generator with `codegen.ts`.
- Configure React Router 6 with route definitions.
- Build `AdminLayout` (sidebar navigation, header with user menu, content area).
- Build `AuthLayout` and Login page.
- Implement `AuthProvider` with JWT token management (access + refresh).
- Add `ProtectedRoute` guard (redirect to login if unauthenticated or non-admin).

### Phase 2 — Dashboard

- Build `Dashboard` page with stat cards.
- Implement user growth and vote activity charts (Recharts).
- Add **pending comments count** widget (highlighted, links to approval queue).
- Add recent comments and recent signups widgets.

### Phase 3 — User Management

- Build `UserList` with Ant Design Table (search, filter, pagination).
- Build `UserDetail` page with activity tabs (votes, comments, sandboxes).
- Implement role change, ban/unban, delete actions with confirmation modals.
- Add bulk selection and bulk actions toolbar.

### Phase 4 — Country Management

- Build `CountryList` with search and sorting.
- Build `CountryForm` (create/edit) with:
  - `BilingualInput` component for fa/en fields.
  - `SlugInput` auto-generated from English name.
  - `ImageUpload` for flag.
  - Inline repeaters for authors and amendments.
  - Map coordinate picker (latitude/longitude).
- Implement delete with cascade warning.

### Phase 5 — Constitution Management

- Build `ConstitutionList` grouped by country.
- Build `ConstitutionForm` with PDF upload.
- Build interactive `ChapterTree` component:
  - Tree view with expand/collapse for chapters → articles → clauses.
  - Inline add/edit/delete buttons at each level.
  - Drag-and-drop reorder within each level.
- Build `ClauseEditor`:
  - Rich text editor for bilingual clause text.
  - `TopicTagSelect` multi-select for assigning topics.
- Implement bulk import (upload JSON/CSV, preview, confirm).

### Phase 6 — Topic Management

- Build `TopicList` with grouping by category.
- Build `TopicForm` with bilingual inputs, category select, order.
- Show clause count badge per topic.

### Phase 7 — Comment Moderation

- Build `CommentModeration` page with **approval queue as the default view** (pending comments first).
- Show comment content, clause context, author info, submission date.
- **Quick-action buttons: approve, reject, delete, restore.**
- Bulk moderation toolbar (bulk approve, bulk reject, bulk delete).
- Tab/filter to switch between pending, approved, rejected, deleted views.
- **Sidebar badge** showing pending comment count (auto-refreshed via polling or Apollo subscription).

### Phase 8 — Vote Analytics

- Build `VoteAnalytics` page with chart widgets.
- Per-clause, per-country, per-topic breakdown tables.
- Date range filter.
- CSV export button.

### Phase 9 — Podcast & Timeline Management

- Build `PodcastList` and `PodcastForm` (audio upload, cover image, metadata).
- Build `TimelineList` and `TimelineForm` (date, bilingual text, country select).

### Phase 10 — Sandbox, Settings & Audit

- Build `SandboxList` (view/delete user remixes).
- Build `FeaturedContent` page (drag-to-reorder featured countries/topics, facts CRUD, heatmap score editor).
- Build `GeneralSettings` page (site metadata, AI chat config, maintenance toggle).
- Build static page editor (rich text for About/Privacy/Terms).
- Build `AuditLog` page with filters and expandable diff rows.

### Phase 11 — Semantic Release & Versioning

Same setup as frontend and backend repos:

| Package | Purpose |
|---|---|
| `semantic-release` | Automated version management & publishing |
| `@commitlint/cli` + `@commitlint/config-conventional` | Enforce Conventional Commits |
| `husky` | Git hooks for commitlint |
| `@semantic-release/changelog` | Auto-generate `CHANGELOG.md` |
| `@semantic-release/git` | Commit version bumps back to repo |
| `@semantic-release/github` | Create GitHub releases |

CI/CD workflow (`.github/workflows/release.yml`) identical to frontend/backend repos.

### Phase 12 — Polish & Testing

- Responsive layout adjustments (tablet-friendly admin).
- Loading skeletons for all data tables.
- Error boundaries and toast notifications (Ant Design message/notification).
- Unit tests for utility functions and validators.
- Integration tests for key flows (login, CRUD operations).
- Accessibility audit (keyboard navigation, ARIA on Ant components).

---

## 6. Reusable Components

| Component | Description |
|---|---|
| `BilingualInput` | Side-by-side or tabbed `fa`/`en` text inputs; works with both plain text and rich text |
| `SlugInput` | Text input that auto-generates a URL-safe slug from another field |
| `ImageUpload` | Drag-and-drop image upload with preview; uploads to backend `POST /upload` endpoint (local storage) |
| `FileUpload` | Generic file upload (PDF constitutions, audio files); uploads to backend `POST /upload` endpoint (local storage) |
| `DataTable` | Wrapper around Ant Design `Table` with built-in search, pagination, column sorting, and bulk select |
| `ConfirmModal` | Reusable delete/action confirmation dialog |
| `StatusBadge` | Color-coded badge for entity statuses (active, banned, deleted, flagged) |
| `ChapterTree` | Hierarchical tree view for constitution structure with inline CRUD and drag-reorder |
| `ClauseEditor` | Rich text editor with bilingual tabs and topic tag assignment |
| `TopicTagSelect` | Multi-select dropdown populated from `adminTopics` query |
| `StatCard` | Dashboard metric card with icon, count, and trend indicator |

---

## 7. Key Technical Decisions

1. **Vite over Next.js** — Backoffice is a pure SPA (no SEO needed), so Vite provides faster DX and simpler deployment.
2. **Ant Design over shadcn/ui** — Ant Design provides production-ready admin components (Table, Form, Tree, Upload, DatePicker) out of the box, reducing custom UI work.
3. **Shared GraphQL schema** — Backoffice connects to the same backend as the frontend; admin-specific resolvers are gated by `@Authorized("admin")`.
4. **Admin role enforcement** — Both client-side (route guards) and server-side (`authChecker`) enforce admin access.
5. **Bilingual-first components** — Every content form uses `BilingualInput` to ensure fa/en content is always entered together.
6. **Comment approval workflow** — The comment moderation page defaults to the pending approval queue. Admins must explicitly approve each comment before it becomes publicly visible on the frontend. Bulk approve/reject is supported for efficiency.
7. **Local file storage** — File uploads (images, PDFs, audio) are sent to the backend `POST /upload` REST endpoint and stored locally in the backend's `uploads/` directory. No cloud storage services are used.
8. **Audit logging** — Every admin mutation triggers an audit log entry on the backend for accountability.
7. **Apollo cache updates** — Mutations update the Apollo cache optimistically to keep the UI responsive without refetching.

---

## 8. Environment Variables

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_UPLOAD_URL=http://localhost:4000/upload
VITE_APP_TITLE=Barabari Admin
```

---

## 9. Non-Functional Requirements

- **Performance:** Table virtualization for large datasets (>1000 rows); lazy-loaded route chunks.
- **Security:** JWT-only auth; no public routes except login; all GraphQL operations require admin role.
- **UX:** Breadcrumb navigation; persistent sidebar state; dark mode toggle.
- **Deployment:** Static SPA build; deployable to Vercel / Netlify / S3+CloudFront / Nginx.
- **Browser support:** Chrome, Firefox, Safari, Edge (latest 2 versions).
