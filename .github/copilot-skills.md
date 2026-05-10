# Copilot Skills — Barabari Frontend

## Skill: Create a New Page

When asked to create a new page:

1. Create a directory under `src/app/(main)/` with the route name (kebab-case)
2. Add a `page.tsx` file as the page component
3. If the page needs a shared layout, add a `layout.tsx` file
4. Use Server Components by default; add `"use client"` only when needed
5. Add translations for any user-facing strings in `src/locale/fa.json` and `src/locale/en.json`
6. Add navigation link in the Navbar component if needed

## Skill: Create a React Component

When asked to create a component:

1. For UI primitives, add to `src/components/ui/` following shadcn/ui patterns
2. For domain components, add to `src/components/<domain>/`
3. Use PascalCase for file and component names
4. Use Tailwind CSS utility classes with `cn()` for conditional styling
5. Accept props via a typed interface
6. Add `"use client"` directive only if the component uses hooks, event handlers, or browser APIs

Example pattern:
```tsx
"use client";

import { cn } from "@/lib/utils";

interface ExampleCardProps {
  title: string;
  className?: string;
}

export function ExampleCard({ title, className }: ExampleCardProps) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
  );
}
```

## Skill: Add a GraphQL Query or Mutation

When asked to add a new GraphQL operation:

1. Add the query document in `src/graphql/queries/<name>.ts` or mutation in `src/graphql/mutations/<name>.ts`
2. Use `gql` tagged template from `@apollo/client`
3. Use the operation in a client component with `useQuery()` or `useMutation()`
4. Define TypeScript types for the response data in `lib/types.ts`

## Skill: Add a Custom Hook

When asked to create a custom hook:

1. Create the hook in `src/hooks/` with `use` prefix (e.g., `useExample.ts`)
2. Use camelCase for the file name
3. Return a well-typed object or tuple
4. Handle loading, error, and data states

## Skill: Add shadcn/ui Component

When asked to add a new shadcn/ui component:

1. Install via `npx shadcn@latest add <component-name>`
2. The component will be added to `src/components/ui/`
3. Import from `@/components/ui/<component>` in consuming components
