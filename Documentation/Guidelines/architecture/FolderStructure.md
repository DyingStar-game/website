# Folder Structure

The project follows the Next.js 15 **App Router** architecture with a clear separation between routing (`app/`), business logic (`src/`), and content (`content/`).

## Global Structure

```
dying-star/
├── 📁 app/                    # Next.js App Router - Routing and layouts
├── 📁 src/                    # Source code - Business logic
├── 📁 content/                # Editorial content (MDX)
├── 📁 public/                 # Static assets
├── 📁 messages/               # i18n translations
├── 📁 docker/                 # Docker configuration
├── 📁 Documentation/          # Internal documentation
├── 📄 middleware.ts           # Next.js global middleware
├── 📄 next.config.ts          # Next.js configuration
├── 📄 tsconfig.json           # TypeScript configuration
└── 📄 package.json            # Dependencies
```

## 📁 `app/` - Next.js App Router

Handles **routing**, **layouts**, and **entry points** of the application following Next.js 15 conventions.

```
app/
├── 📁 [locale]/               # Internationalized routes (en, fr, etc.)
│   ├── 📁 (layout)/           # Route group - Static pages
│   │   └── 📁 pageName/       # Page folder
│   |       └── 📁 _components/ # Components folder
│   ├── 📁 @modal/             # Parallel route - Modal system with intercepting routes
│   └── 📁 docs/               # User documentation with dynamic pages
```

**Key Concepts:**

- **Route Groups** `(name)`: Organize without affecting URL
- **Parallel Routes** `@modal`: Display multiple pages simultaneously
- **Intercepting Routes**: Modals that preserve history
- **Dynamic Routes** `[slug]`: Parameterized routes

## 📁 `src/` - Application source code

Contains all **business logic**, **components**, and **utilities** following a feature-based architecture.

```
src/
├── 📁 components/             # Reusable UI components
├── 📁 features/               # Business features (vertical slices)
├── 📁 hooks/                  # Cross-cutting React hooks
├── 📁 i18n/                   # i18n configuration (config, routing, navigation, request)
├── 📁 lib/                    # Libraries and utilities
└── 📁 types/                  # Global TypeScript types
```

**Feature-based architecture:**

- Each feature in `features/` is **autonomous** and contains its logic, components, types
- Clear separation between **UI** (`components/`), **logic** (`features/`), **utilities** (`lib/`, `hooks/`)

## 📁 `content/` - Editorial content

MDX files (Markdown + JSX) for dynamic content organized by locale.

## 📁 `public/` - Static assets

Static files served directly by Next.js.

**Access:** `/images/logo.png` → `public/images/logo.png`

## 📁 `messages/` - i18n translations

Translation dictionaries for internationalization.

```
messages/                      # JSON translation files per locale (en.json, fr.json)
```

**Usage:**

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
```

## 📁 `docker/` - Containerization

Docker configuration for development and production environments.

```
docker/                        # Dockerfile.dev, Dockerfile.prod, docker-compose.yml
```

## 📁 `Documentation/` - Internal documentation

Project documentation, guidelines, and ADRs.

```
Documentation/
└── 📁 Guidelines/
    ├── 📁 architecture/       # Architecture docs and ADRs
    └── 📁 pictures/           # Documentation images
```

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Project Structure](https://nextjs.org/docs/getting-started/project-structure)
- [Complete structure details](./projectTreeFolder.md)
