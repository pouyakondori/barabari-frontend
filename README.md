# Barabari Frontend

> Public-facing web application for the Barabari constitutional analysis and comparison platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## About

Barabari is a platform dedicated to empowering citizens through constitutional literacy. It provides deep-dive analysis of the Iranian Constitution, interactive comparisons with constitutions from around the world, and collaborative tools for civic engagement.

This repository contains the **frontend application** — the public-facing website where users can:

- Explore country profiles and their constitutional frameworks
- Read full constitution texts with interactive, clickable clauses
- Vote (Agree/Disagree) on individual constitutional clauses
- Comment on clauses (comments require admin approval before publishing)
- Compare constitutions across countries by topic (e.g., freedom of speech, right to education)
- View global heatmaps and popularity-ranked comparison tables
- Listen to podcasts analyzing different constitutions
- Build a custom "remix" constitution in the sandbox
- Chat with an AI assistant about constitutional topics

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [React 18](https://react.dev/) | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI component library |
| [Apollo Client](https://www.apollographql.com/docs/react/) | GraphQL client |
| [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) | Typed GraphQL hooks |
| [next-intl](https://next-intl-docs.vercel.app/) | i18n (Persian + English) |
| [react-simple-maps](https://www.react-simple-maps.io/) | Global heatmaps |
| [Recharts](https://recharts.org/) | Comparative charts |
| [AI SDK](https://sdk.vercel.ai/) | Streaming AI chatbot |

## Related Repositories

| Repository | Description |
|---|---|
| [barabari-backend](https://github.com/pouyakondori/barabari-backend) | GraphQL API server (Node.js, TypeGraphQL, MongoDB) |
| [barabari-backoffice](https://github.com/pouyakondori/barabari-backoffice) | Admin panel (Vite, React, Ant Design) |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see [barabari-backend](https://github.com/pouyakondori/barabari-backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/pouyakondori/barabari-frontend.git
cd barabari-frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Generate GraphQL types
npm run codegen

# Start development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_CHAT_API_URL=http://localhost:4000/api/chat
```

## Project Structure

```
app/                  # Next.js App Router pages
components/           # Reusable React components
graphql/              # GraphQL queries, mutations & generated types
lib/                  # Utilities, Apollo client, constants
hooks/                # Custom React hooks
public/               # Static assets & i18n locale files
docs/                 # Project documentation & implementation plans
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run codegen` | Generate GraphQL types from schema |

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
4. Push and open a Pull Request

This project uses **semantic-release** — version bumps and changelogs are automated based on commit messages.

## License

This project is licensed under the [MIT License](./LICENSE).
