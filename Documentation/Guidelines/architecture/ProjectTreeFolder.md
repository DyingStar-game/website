# Project Tree - Complete File Structure

This document provides a detailed file-by-file breakdown of the entire repository structure.

For a high-level overview, see [FolderStructure.md](./FolderStructure.md).

---

## 📂 Root Directory

### Configuration Files

- **`.nvmrc`** — Node.js version specification (ensures consistency across environments)
- **`.prettierrc`** — Code formatting rules for Prettier
- **`components.json`** — Configuration for shadcn/ui component generator
- **`eslint.config.mjs`** — ESLint rules (TypeScript, React, Next.js)
- **`next.config.ts`** — Next.js framework configuration
- **`next-env.d.ts`** — Next.js TypeScript declarations (auto-generated)
- **`postcss.config.mjs`** — Tailwind CSS / PostCSS pipeline configuration
- **`tsconfig.json`** — TypeScript configuration (path aliases, strict mode, compiler options)
- **`tsconfig.tsbuildinfo`** — TypeScript build cache (auto-generated)

### Package Management

- **`package.json`** — Project dependencies and npm scripts
- **`pnpm-lock.yaml`** — Lock file for pnpm (ensures reproducible installs)

### Build & Development

- **`Makefile`** — Development shortcuts and build commands (e.g., `make dev`, `make build`)
- **`middleware.ts`** — Global Next.js middleware (runs before routing: i18n, auth, redirects)

### Documentation & Legal

- **`README.md`** — Project overview, quickstart guide, and useful links
- **`LICENSE`** — Project license file

---

## 📂 app/ — Next.js App Router

The routing layer of the application. Handles layouts, error boundaries, and entry points.

### Root Level (app/)

```
app/
├── layout.tsx              # Root HTML layout (html, body, theme provider, fonts)
├── error.tsx               # Root error boundary
├── global-error.tsx        # Global error fallback
├── unauthorized.tsx        # Generic 401 unauthorized page
├── sitemap.tsx             # Dynamic sitemap generation for SEO
├── favicon.ico             # Browser favicon
├── icon.png                # PWA icon
└── apple-icon.png          # Apple touch icon
```

### Internationalized Routes (app/[locale]/)

```
app/[locale]/
├── layout.tsx              # Locale-specific layout wrapper
├── providers.tsx           # React context providers (theme, i18n, query client)
├── not-found.tsx           # Locale-specific 404 page
├── globals.css             # Global CSS styles (reset, design tokens, Tailwind imports)
├── manifest.ts             # PWA manifest generator
│
├── (landing)/              # Route group: Landing page
│   └── page.tsx            # Home/landing page
│
├── (layout)/               # Route group: Public static pages
│   ├── about/
│   │   └── page.tsx        # About page
│   │
│   ├── legal/
│   │   ├── privacy/
│   │   │   └── page.tsx    # Privacy policy page
│   │   └── terms/
│   │       └── page.tsx    # Terms & conditions page
│   │
│   ├── news/
│   │   ├── page.tsx        # News listing page
│   │   ├── loading.tsx     # Loading state for news pages
│   │   └── [slug]/
│   │       ├── page.tsx    # Individual news article page
│   │       ├── error.tsx   # Error boundary for article pages
│   │       ├── not-found.tsx  # 404 for missing articles
│   │       └── newsSlugMetadataImage.tsx  # Dynamic OG image generator
│   │
│   └── not-found/
│       └── page.tsx        # Custom 404 page in layout segment
│
├── (logged-in)/            # Route group: Protected pages (requires auth)
│   ├── error.tsx           # Error boundary for authenticated pages
│   ├── not-found.tsx       # 404 for authenticated section
│   └── unauthorized.tsx    # 401 for logged-in section
│
├── @modal/                 # Parallel route: Modal system
│   ├── [...catchAll]/
│   │   └── page.tsx        # Catch-all for intercepted routes
│   └── default.tsx         # Default empty slot when no modal active
│
└── docs/                   # Documentation section
    ├── layout.tsx          # Docs layout with sidebar
    ├── page.tsx            # Docs home page
    ├── doc-manager.ts      # Logic for loading and parsing docs
    ├── [slug]/
    │   └── page.tsx        # Dynamic doc pages
    └── _components/
        └── doc-sidebar.tsx # Documentation sidebar component
```

**Key Concepts:**

- **Route Groups** `(name)`: Organize routes without affecting URL structure
- **Parallel Routes** `@modal`: Render multiple pages simultaneously (modal overlays)
- **Intercepting Routes**: Modals that preserve navigation history
- **Dynamic Routes** `[slug]`: Parameterized routes for dynamic content

---

## 📂 src/ — Application Source Code

All business logic, components, features, and utilities.

### src/components/ — Reusable UI Components

```
src/components/
├── DS/                     # DyingStar Design System (project-specific components)
│   ├── automatic-pagination.tsx
│   ├── divider.tsx
│   ├── grid-background.tsx
│   ├── keyboard-shortcut.tsx
│   ├── loader.tsx
│   ├── logo.tsx
│   ├── typography.tsx
│   │
│   ├── CTA/                # Call-to-action components
│   │   └── ...
│   │
│   ├── layout/             # Layout components
│   │   ├── base-layout.tsx
│   │   ├── header.tsx
│   │   ├── header-base.tsx
│   │   ├── footer.tsx
│   │   └── footer.link.tsx
│   │
│   ├── legal/              # Legal components (floating footer, etc.)
│   │   └── ...
│   │
│   └── TODO/               # Work-in-progress components
│       └── ...
│
├── ui/                     # shadcn/ui components (primitive UI elements)
│   ├── accordion.tsx
│   ├── alert.tsx
│   ├── alert-dialog.tsx
│   ├── aspect-ratio.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── input-otp.tsx
│   ├── label.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toggle.tsx
│   └── tooltip.tsx
│
├── svg/                    # SVG React components
│   └── ...
│
└── utils/                  # Visual utility components
    ├── intercept-dialog/   # Intercepting route dialog utilities
    └── tailwind-indicator/ # Dev mode visual indicator for responsive breakpoints
```

### src/features/ — Business Features (Vertical Slices)

Each feature is self-contained with its own logic, components, and types.

```
src/features/
├── dialog-manager/         # Global dialog system
│   ├── dialog-factory.tsx  # Dialog component factory
│   ├── dialog-renderer.tsx # Dialog rendering logic
│   ├── dialog-store.ts     # Zustand store for dialog state
│   └── dialog.type.ts      # Dialog type definitions
│
├── form/                   # Form utilities
│   ├── auto-save-form.tsx  # Auto-save form wrapper
│   └── submit-button.tsx   # Enhanced submit button with loading states
│
├── global-dialog/          # Pre-configured global dialogs
│   └── ...
│
├── i18n/                   # Internationalization UI
│   └── LocaleSwitcher.tsx  # Language switcher component
│
├── landing/                # Landing page features
│   ├── landing-CTA.tsx     # Landing page CTAs
│   └── landing-layout.tsx  # Landing page layout wrapper
│
├── markdown/               # Markdown/MDX rendering
│   ├── client-markdown.tsx # Client-side markdown renderer
│   ├── server-mdx.tsx      # Server-side MDX renderer
│   └── markdown.config.ts  # Markdown processing configuration
│
├── navigation/             # Navigation system
│   ├── Links.ts            # Link definitions
│   ├── navigation.type.ts  # Navigation type definitions
│   ├── navigation-wrapper.tsx
│   └── navigationLinks.tsx # Navigation link components
│
├── news/                   # News feature
│   ├── NewsItem.tsx        # Full news item component
│   ├── NewsItemLight.tsx   # Lightweight news item
│   ├── news-manager.ts     # News loading and management
│   └── calculate-reading-time.ts  # Reading time calculation
│
├── page/                   # Page utilities
│   ├── error-page.tsx      # Error page templates
│   ├── not-found-page.tsx  # 404 page template
│   └── top-loader.tsx      # Top loading progress bar
│
└── server-sonner/          # Server-to-client toast notifications
    └── ...
```

### src/hooks/ — Cross-cutting React Hooks

```
src/hooks/
├── use-debounce-fn.ts              # Debounce function execution
├── use-is-client.ts                # Client-side rendering detection
├── use-mobile.ts                   # Mobile device detection
├── use-warn-if-unsaved-changes.ts  # Prompt before leaving with unsaved changes
└── useCurrentPath.ts               # Current pathname hook
```

### src/i18n/ — Internationalization Configuration

```
src/i18n/
├── config.ts               # i18n configuration (locales, default locale)
├── routing.ts              # Localized routing utilities
├── navigation.ts           # i18n-aware navigation utilities
└── request.ts              # Server-side locale detection
```

### src/lib/ — Libraries and Utilities

```
src/lib/
├── actions/                # Server Actions utilities
│   ├── safe-actions.ts     # Type-safe server action wrapper
│   └── ...
│
├── env/                    # Environment variable validation
│   ├── client.ts           # Client-side env vars (Zod validation)
│   └── server.ts           # Server-side env vars (Zod validation)
│
├── errors/                 # Error types and handling
│   ├── ActionError.ts      # Server action error type
│   ├── ApplicationError.ts # Application error type
│   └── ZodRouteError.ts    # Route validation error type
│
├── format/                 # Formatting utilities
│   ├── date.ts             # Date formatting
│   ├── display-name.ts     # Display name utilities
│   └── id.ts               # ID generation and formatting
│
├── logger.ts               # Logging utility (tslog)
├── metadata.ts             # Page metadata generator (SEO/OG tags)
├── server-toast.tsx        # Server-to-client toast bridge
├── server-url.ts           # Server-side URL generation
├── utils.ts                # General utility functions (cn, etc.)
└── zod-route.ts            # Route parameter validation with Zod
```

### src/types/ — Global TypeScript Types

```
src/types/
└── next.ts                 # Next.js custom/extended type definitions
```

### Other src/ Files

```
src/
├── middleware.ts           # Additional middleware (if needed beyond root)
└── site-config.ts          # Central site configuration (name, links, social, feature flags)
```

---

## 📂 content/ — Editorial Content

MDX files for dynamic content, organized by locale.

```
content/
└── news/                   # News articles
    ├── en/                 # English articles
    │   └── *.mdx           # Individual news articles (frontmatter + MDX)
    └── fr/                 # French articles
        └── *.mdx           # Individual news articles (frontmatter + MDX)
```

**MDX Structure:**

- Frontmatter with metadata (title, date, author, category, etc.)
- Markdown body with JSX components support
- Parsed by `features/news/news-manager.ts`
- Rendered by `features/markdown/`

---

## 📂 public/ — Static Assets

Files served directly by Next.js without processing.

```
public/
├── images/                 # Static images
│   └── ...                 # Logos, backgrounds, illustrations
│
├── assets/                 # Other static assets
│   └── ...
│
└── *.svg                   # Category icons for news
    ├── immersion-landscape.svg
    ├── news-architectes.svg
    ├── news-archives.svg
    ├── news-colonisation.svg
    ├── news-expedition.svg
    └── news-observatoire.svg
```

**Access:** Files in `public/` are served from root path  
Example: `public/images/logo.png` → `/images/logo.png`

---

## 📂 messages/ — i18n Translation Dictionaries

JSON translation files for internationalization (used by next-intl).

```
messages/
├── en.json                 # English translations
└── fr.json                 # French translations
```

**Structure:**

```json
{
  "namespace": {
    "key": "Translation value"
  }
}
```

**Usage:**

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
```

---

## 📂 docker/ — Containerization

Docker configuration for development and production environments.

```
docker/
├── Dockerfile.dev          # Development Docker image
├── Dockerfile.prod         # Production Docker image
└── docker-compose.yml      # Local/preview orchestration
```

---

## 📂 Documentation/ — Internal Documentation

Project documentation, guidelines, processes, and Architecture Decision Records (ADRs).

```
Documentation/
└── Guidelines/
    ├── architecture/       # Architecture documentation
    │   ├── Architecture.md         # Main architecture overview
    │   ├── FolderStructure.md      # High-level folder structure
    │   ├── ProjectTreeFolder.md    # This file (detailed file tree)
    │   ├── FileTypes.md            # File naming conventions and patterns
    │   ├── ADRs.md                 # ADR index
    │   └── ADR/                    # Individual ADR documents
    │       └── ...
    │
    ├── pictures/           # Documentation images and diagrams
    │   └── ...
    │
    ├── CodeReviewProcess.md       # Code review guidelines
    ├── DevelopmentProcess.md      # Development workflow
    ├── Onboarding.md              # Onboarding guide for new developers
    └── ReleaseAndDeployment.md    # Release and deployment procedures
```

---

## 🔄 Data Flow Examples

### News Pipeline

```
content/news/{locale}/*.mdx
    ↓
features/markdown/server-mdx.tsx (parsing)
    ↓
features/news/news-manager.ts (loading, metadata, reading time)
    ↓
app/[locale]/(layout)/news/page.tsx (listing)
app/[locale]/(layout)/news/[slug]/page.tsx (detail)
```

### Component Import Flow

```
src/components/ui/button.tsx (primitive)
    ↓
src/components/DS/CTA/... (design system)
    ↓
src/features/landing/landing-CTA.tsx (feature)
    ↓
app/[locale]/(landing)/page.tsx (page)
```

### i18n Flow

```
messages/{locale}.json (translations)
    ↓
src/i18n/config.ts (configuration)
    ↓
middleware.ts (locale detection)
    ↓
app/[locale]/layout.tsx (provider)
    ↓
components (useTranslations hook)
```

---

## 📝 Notes

- **Path Aliases**: See [FolderStructure.md](./FolderStructure.md) for TypeScript path alias configuration
- **File Types**: See [FileTypes.md](./FileTypes.md) for detailed file naming conventions
- **Architecture**: See [Architecture.md](./Architecture.md) for tech stack and non-functional requirements
- **Auto-generated files**: `.next/`, `node_modules/`, `*.tsbuildinfo` are not included in this tree

---

## 🔗 References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [FolderStructure.md](./FolderStructure.md) - High-level architecture overview
- [FileTypes.md](./FileTypes.md) - File naming patterns and conventions
