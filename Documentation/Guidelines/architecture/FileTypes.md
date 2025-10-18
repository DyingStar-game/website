# File Types and Naming Conventions

## Overview

This document provides a comprehensive guide to the file naming conventions and architectural patterns used throughout the DyingStar codebase. Each file type serves a specific purpose and follows strict conventions to maintain code organization, readability, and maintainability.

---

## Table of Contents

1. [File Type Reference](#file-type-reference)
2. [Detailed Explanations](#detailed-explanations)
3. [Directory Structure Patterns](#directory-structure-patterns)
4. [Path Aliases](#path-aliases)
5. [Best Practices](#best-practices)

---

## File Type Reference

Quick reference table for all file types:

| Extension/Pattern    | Purpose                                             | Location                                   | Example                            |
| -------------------- | --------------------------------------------------- | ------------------------------------------ | ---------------------------------- |
| `*.tsx`              | React components with JSX                           | `src/components/`, `src/features/`, `app/` | `button.tsx`, `header.tsx`         |
| `*.ts`               | Pure TypeScript logic (utilities, configs, helpers) | `src/lib/`, `src/hooks/`, `src/i18n/`, `src/features/`, `app/`      | `utils.ts`, `logger.ts`            |
| `*.type.ts`          | Type definitions and Zod schemas                    | Any `src/` subdirectory                    | `navigation.type.ts`               |
| `*.hook.ts`          | Custom React hooks (outside `src/hooks/`)           | `src/features/*/`                          | `use-news-filter.hook.ts`          |
| `*.link.ts`          | Navigation link logic and definitions               | `src/features/navigation/`                 | `footer.link.tsx`, `Links.ts`      |
| `*.query.ts`         | Prisma database queries                             | `src/lib/queries/`                         | `user.query.ts`                    |
| `*.query.hook.ts`    | TanStack Query (React Query) queries                | `src/features/*/`                          | `news.query.hook.ts`               |
| `*.mutation.hook.ts` | TanStack Query mutations                            | `src/features/*/`                          | `create-user.mutation.hook.ts`     |
| `*.action.ts`        | Server actions (Next.js Server Actions)             | `src/lib/actions/`                         | `newsletter.action.ts`             |
| `*.mdx`              | Markdown with JSX for content-driven pages          | `content/news/`, `app/`                    | `demo.mdx`                         |
| `*.config.ts`        | Configuration files                                 | Root, `src/i18n/`                          | `next.config.ts`, `site-config.ts` |
| `middleware.ts`      | Next.js middleware (routing, i18n, auth)            | Root, `src/`                               | `middleware.ts`                    |
| `layout.tsx`         | Next.js layouts                                     | `app/` segments                            | `layout.tsx`                       |
| `page.tsx`           | Next.js pages/routes                                | `app/` segments                            | `page.tsx`                         |
| `loading.tsx`        | Next.js loading UI                                  | `app/` segments                            | `loading.tsx`                      |
| `error.tsx`          | Next.js error boundaries                            | `app/` segments                            | `error.tsx`, `global-error.tsx`    |
| `not-found.tsx`      | Next.js 404 pages                                   | `app/` segments                            | `not-found.tsx`                    |
| `route.ts`           | Next.js API routes                                  | `app/api/`                                 | `route.ts`                         |

---

## Detailed Explanations

### 1. `*.tsx` - React Components

**Purpose**: Files containing React components that use JSX syntax.

**Location**:

- `src/components/` - Reusable UI components
- `src/features/` - Feature-specific components
- `app/` - Next.js App Router pages and layouts

**Conventions**:

- Use PascalCase for component names
- Use camelCase for file names
- One primary component per file
- Export component and related types

**Example**:

```tsx
// src/components/ui/button.tsx
import * as React from "react";

import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva("justify-center... inline-flex items-center", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground...",
      destructive: "bg-destructive text-white...",
    },
    size: {
      default: "px-6 py-2",
      sm: "px-5 py-2",
    },
  },
});

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

**Usage Scenarios**:

- UI components (buttons, inputs, cards)
- Layout components (headers, footers, sidebars)
- Feature components (news items, forms, dialogs)
- Page components in the App Router

---

### 2. `*.ts` - Pure TypeScript Logic

**Purpose**: Pure TypeScript files without JSX, containing business logic, utilities, configurations, or helper functions.

**Location**:

- `src/lib/` - Core utilities and libraries
- `src/hooks/` - React hooks
- `src/i18n/` - Internationalization logic
- Root directory - Configuration files

**Conventions**:

- Use camelCase for file names (except configs)
- Pure functions without side effects (when possible)
- No React or JSX imports
- Thoroughly documented with JSDoc

**Example**:

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and merges Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Usage Scenarios**:

- Utility functions (`utils.ts`, `format.ts`)
- Configuration (`site-config.ts`, `routing.ts`)
- Non-React helpers (`logger.ts`, `server-url.ts`)

---

### 3. `*.type.ts` - Type Definitions and Schemas

**Purpose**: Dedicated files for TypeScript type definitions and Zod validation schemas. This pattern centralizes type safety and runtime validation.

**Location**: Any `src/` subdirectory, typically alongside related logic

**Conventions**:

- Define both Zod schemas and TypeScript types
- Export schemas and infer types from them
- Group related types logically
- Use clear, descriptive region comments

**Example**:

```ts
// src/features/navigation/navigation.type.ts

TODO ADD FILE EXAMPLE

```

**Why This Pattern**:

- **Type Safety**: Compile-time type checking via TypeScript
- **Runtime Validation**: Zod schemas validate data at runtime
- **Single Source of Truth**: Types are inferred from schemas
- **Documentation**: Schemas serve as self-documenting contracts

**Usage Scenarios**:

- API response/request types
- Component prop types
- Database model types
- Form validation schemas

---

### 4. `*.hook.ts` - Custom React Hooks (Feature-Specific)

**Purpose**: Custom React hooks that are specific to a feature and not general enough to belong in `src/hooks/`.

**Location**: Within feature directories (`src/features/*/`)

**Conventions**:

- File name should match hook name
- Use `use` prefix for hook functions
- Export one primary hook per file
- Include TypeScript types for parameters and return values

**Example**:

```ts
// src/features/news/use-news-filter.hook.ts
import { useMemo, useState } from "react";

import type { NewsItem } from "./news.type";

export function useNewsFilter(items: NewsItem[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = !category || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, category]);

  return {
    filteredItems,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
  };
}
```

**Difference from `src/hooks/`**:

- `src/hooks/*.ts` - General-purpose, reusable across features
- `*.hook.ts` - Feature-specific, co-located with feature code

**Usage Scenarios**:

- Feature-specific state management
- Complex component logic extraction
- Business logic hooks tied to a feature

---

### 5. `*.link.ts` / `*.link.tsx` - Navigation Link Definitions

**Purpose**: Centralized navigation link definitions and logic, providing type-safe routing throughout the application.

**Location**: `src/features/navigation/`

**Conventions**:

- Define link structure with params
- Use link generator functions for dynamic routes
- Export typed link objects
- Support both static and parameterized links

**Example**:

```ts
// src/features/navigation/Links.ts
import { z } from "zod";

import type { NavigationLink } from "./navigation.type";

const PATHS = {
  NEWS: `/news/:newsSlug`,
};

export const EmptyLinkParamsSchema = z.object({}).strict();

export const NewsLinkParamsSchema = EmptyLinkParamsSchema.extend({
  newsSlug: z.string(),
}).strict();

// Utility to create link generators
const createLinkGenerator = (path: string, needsParams = false) => {
  if (!needsParams) {
    return () => path;
  }

  return (params: Record<string, string> = {}) => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value);
    });
    return result;
  };
};

const createLink = (
  href: string,
  label: string,
  options: Partial<Omit<NavigationLink, "href" | "label">> = {},
  needsParams = false,
): NavigationLink => ({
  href: createLinkGenerator(href, needsParams),
  label,
  ...options,
});

export const LINKS = {
  Landing: {
    Landing: createLink("/", "Project", undefined, false),
  },
  News: {
    All: createLink("/news", "All News", undefined, false),
    News: createLink(`${PATHS.NEWS}`, "News", { Icon: Info }, true),
  },
};
```

**Benefits**:

- Type-safe navigation
- Centralized route definitions
- Easy refactoring (change route in one place)
- Auto-complete for links throughout the app

**Usage Scenarios**:

- Navigation menus
- Footer links
- Programmatic navigation
- Link generation with parameters

---

### 6. `*.query.ts` - Prisma Database Queries

**Purpose**: Encapsulates Prisma database queries in reusable, testable functions.

**Location**: `src/lib/queries/` or within feature directories

**Conventions**:

- One query function per operation
- Use descriptive function names
- Include error handling
- Return typed results

**Example**:

```ts
// src/lib/queries/user.query.ts
import { prisma } from "@lib/prisma";
import type { User } from "@prisma/client";

export async function getUserById(userId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });
}

export async function getUsersByRole(role: string): Promise<User[]> {
  return prisma.user.findMany({
    where: { role },
    orderBy: { createdAt: "desc" },
  });
}
```

**Why Separate Query Files**:

- **Testability**: Easy to mock in tests
- **Reusability**: Share queries across features
- **Maintainability**: Database logic in one place
- **Performance**: Optimize queries independently

---

### 7. `*.query.hook.ts` - TanStack Query (React Query)

**Purpose**: React hooks that use TanStack Query for server state management, caching, and synchronization.

**Location**: Within feature directories

**Conventions**:

- Use `useQuery` from TanStack Query
- Define query keys at the top
- Include proper TypeScript types
- Handle loading and error states

**Example**:

```ts
// src/features/news/news.query.hook.ts
import { useQuery } from "@tanstack/react-query";

import type { NewsItem } from "./news.type";

// Query keys
export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filters: string) => [...newsKeys.lists(), { filters }] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (slug: string) => [...newsKeys.details(), slug] as const,
};

// Fetch function
async function fetchNewsItem(slug: string): Promise<NewsItem> {
  const res = await fetch(`/api/news/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  return res.json();
}

// React Query hook
export function useNewsItem(slug: string) {
  return useQuery({
    queryKey: newsKeys.detail(slug),
    queryFn: () => fetchNewsItem(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

**Benefits**:

- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

---

### 8. `*.mutation.hook.ts` - TanStack Query Mutations

**Purpose**: React hooks for data mutations (create, update, delete) using TanStack Query.

**Location**: Within feature directories

**Conventions**:

- Use `useMutation` from TanStack Query
- Include optimistic updates
- Invalidate relevant queries
- Handle success/error callbacks

**Example**:

```ts
// src/features/news/create-news.mutation.hook.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { newsKeys } from "./news.query.hook";
import type { CreateNewsInput, NewsItem } from "./news.type";

async function createNews(data: CreateNewsInput): Promise<NewsItem> {
  const res = await fetch("/api/news", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create news");
  return res.json();
}

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      // Invalidate and refetch news list
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}
```

**Usage**:

```tsx
function CreateNewsForm() {
  const createNews = useCreateNews();

  const handleSubmit = (data: CreateNewsInput) => {
    createNews.mutate(data, {
      onSuccess: () => {
        toast.success("News created!");
      },
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

### 9. `*.action.ts` - Next.js Server Actions

**Purpose**: Server-side functions that can be called from client components, providing type-safe RPC-style endpoints.

**Location**: `src/lib/actions/` or within feature directories

**Conventions**:

- Use `"use server"` directive
- Use `next-safe-action` for validation
- Define input schemas with Zod
- Handle errors gracefully

**Example**:

```ts
// src/lib/actions/newsletter.action.ts
"use server";

import { action } from "@lib/actions/safe-actions";
import { z } from "zod";

// src/lib/actions/newsletter.action.ts

const subscribeNewsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const subscribeNewsletter = action
  .inputSchema(subscribeNewsletterSchema)
  .action(async ({ parsedInput: { email, name } }) => {
    // Add to newsletter service
    await addToMailingList(email, name);

    return { success: true, message: "Successfully subscribed!" };
  });
```

**Usage in Client Component**:

```tsx
"use client";

import { subscribeNewsletter } from "@lib/actions/newsletter.action";

export function NewsletterForm() {
  const [, execute, isPending] = useAction(subscribeNewsletter);

  const handleSubmit = async (formData: FormData) => {
    const result = await execute({
      email: formData.get("email") as string,
    });

    if (result.data?.success) {
      toast.success(result.data.message);
    }
  };

  return <form action={handleSubmit}>...</form>;
}
```

**Benefits**:

- Type-safe client-server communication
- Automatic validation
- No need for API routes for simple operations
- Direct database access from actions

---

### 10. `*.mdx` - Markdown with JSX

**Purpose**: Content-driven pages that combine Markdown for text content with React components for interactive elements.

**Location**:

- `content/news/` - Editorial content (articles, blog posts)
- `app/` - Static/semi-static pages

**Conventions**:

- Frontmatter for metadata
- Localized content (separate files per language)
- Use JSX components when needed

**Example**:

````mdx
---
title: Introducing Our New Feature
titleIcon: 🎉
category: announcement
description: We're excited to announce a new feature that will change how you work
keywords:
  - feature
  - announcement
  - update
tags:
  - product
  - release
coverUrl: https://example.com/cover.jpg
date: 2025-01-15T10:00:00
author: Team DyingStar
authorRoles:
  - Product Manager
---

# Introducing Our New Feature

We're thrilled to announce our latest feature!

## What's New

Here's what you can expect:

- **Feature 1**: Description
- **Feature 2**: Description

```ts
// Code example
const example = "You can include code blocks";
```
````

<CustomComponent prop="value" />

## Get Started

Try it out today!

````

**Processing Pipeline**:
1. MDX file stored in `content/`
2. Parsed by `features/markdown/`
3. Managed by feature-specific manager (e.g., `news-manager.ts`)
4. Rendered in App Router pages
5. Metadata extracted for SEO

**Benefits**:
- Easy content authoring
- Mix static content with dynamic components
- Type-safe component usage
- Great for non-technical content editors

---

### 11. Configuration Files

#### `site-config.ts`

**Purpose**: Central configuration for site-wide settings.

**Example**:

```ts
// src/site-config.ts
export const SiteConfig = {
  title: "Dying Star",
  description: "Collect and showcase powerful video and text testimonials",
  prodUrl: "https://demo.dyingstar.app",
  appId: "dyingstar",
  domain: "demo.dyingstar.app",
  appIcon: "/images/icon.png",
};
````

#### `middleware.ts`

**Purpose**: Next.js middleware for request interception and modification.

**Example**:

```ts
// middleware.ts
import { routing } from "i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "nodejs",
};
```

---

### 12. Next.js App Router Special Files

#### `layout.tsx`

**Purpose**: Shared UI that wraps pages within a route segment.

**Key Features**:

- Persists across navigation
- Can fetch data
- Can be nested

**Example**:

```tsx
// app/[locale]/layout.tsx
export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

#### `page.tsx`

**Purpose**: Unique UI for a route.

**Example**:

```tsx
// app/[locale]/(landing)/page.tsx
export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <CTA />
    </main>
  );
}
```

#### `loading.tsx`

**Purpose**: Loading UI shown during Suspense boundaries.

**Example**:

```tsx
// app/[locale]/news/loading.tsx
export default function NewsLoading() {
  return <Skeleton className="h-screen" />;
}
```

#### `error.tsx`

**Purpose**: Error UI for error boundaries.

**Example**:

```tsx
// app/[locale]/news/error.tsx
"use client";

export default function NewsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

#### `not-found.tsx`

**Purpose**: 404 UI for when `notFound()` is called.

**Example**:

```tsx
// app/[locale]/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <Link href="/">Go home</Link>
    </div>
  );
}
```

---

## Directory Structure Patterns

### Feature-Based Organization

The codebase follows a feature-based architecture where related files are co-located:

```
src/features/news/
├── news.type.ts              # Types and schemas
├── news-manager.ts           # Core business logic
├── news.query.hook.ts        # Data fetching
├── NewsItem.tsx              # Component
├── NewsItemLight.tsx         # Variant component
└── use-news-filter.hook.ts   # Feature-specific hook
```

### Component Organization

```
src/components/
├── DS/                       # Design System
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── footer.link.tsx
│   ├── CTA/
│   └── typography.tsx
├── ui/                       # shadcn/ui components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
└── utils/                    # Component utilities
```

### Library Organization

```
src/lib/
├── actions/
│   ├── safe-actions.ts       # Action client setup
│   └── actions-utils.ts      # Action utilities
├── errors/
│   ├── application-error.ts
│   └── action-error.ts
├── format/
│   ├── date.ts
│   └── display-name.ts
└── utils.ts                  # General utilities
```

---

## Path Aliases

The project uses TypeScript path aliases for clean imports:

```json
{
  "paths": {
    "@components/*": ["components/*"],
    "@feat/*": ["features/*"],
    "@hooks/*": ["hooks/*"],
    "@i18n/*": ["i18n/*"],
    "@lib/*": ["lib/*"],
    "@type/*": ["types/*"],
    "@ui/*": ["components/ui/*"]
  }
}
```

**Usage**:

```tsx
// Instead of:
import { Button } from "../../../components/ui/button";

// Use:
import { Button } from "@ui/button";
```

---

## Best Practices

### 1. **Single Responsibility**

- One file, one purpose
- Keep files focused and small
- Extract complex logic into separate files

### 2. **Type Safety**

- Always use TypeScript
- Define types in `*.type.ts` files
- Use Zod for runtime validation

### 3. **Co-location**

- Keep related files together
- Feature files in feature directories
- Types next to their implementation

### 4. **Naming Consistency**

- Follow file naming conventions strictly
- Use descriptive names
- Match file name to primary export

### 5. **Documentation**

- Add JSDoc comments to public APIs
- Document complex logic
- Include usage examples

### 6. **Separation of Concerns**

- UI components separate from business logic
- Data fetching separate from presentation
- Server code separate from client code

### 7. **Import Organization**

- External imports first
- Internal imports second
- Use path aliases
- Group imports logically

### 8. **Avoid Circular Dependencies**

- Be mindful of import chains
- Use dependency injection when needed
- Extract shared code to common locations

---

## Summary

This file type system creates a highly organized, scalable, and maintainable codebase:

- **Clear Separation**: Each file type has a distinct purpose
- **Type Safety**: TypeScript and Zod ensure correctness
- **Co-location**: Related code lives together
- **Discoverability**: Naming conventions make files easy to find
- **Scalability**: Pattern supports growth without chaos

By following these conventions, developers can:

- Quickly understand code structure
- Locate relevant files instantly
- Maintain consistency across the codebase
- Onboard new team members efficiently
- Scale the application confidently

---

**Last Updated**: October 2025  
**Maintained By**: DyingStar Web Development Team
