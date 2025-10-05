# Project Folder Structure

Here is the folder structure of the repository.
You can find all informations for each folder

---

# Root

- **.env.sample** — Template for environment variables.
  → Keep it updated, never include real secrets.

- **.github/workflows/** — GitHub Actions CI/CD Pipeline
  - **build.yml** — Deploy pipeline (build/test/deploy).

- **.nvmrc** — Node.js version to use.

- **.prettierrc** — Code formatting rules.
  → Works alongside ESLint.

- **.vscode/** — Shared editor config (snippets, settings, extensions).

- **Documentation/Guidelines/** — Internal documentation (conventions, processes, ADRs, etc.).
  → Store common "how-to" workflows (release, i18n, contribution).

- **LICENSE** — Project license.

- **Makefile** — Development shortcuts (e.g., `make dev`, `make build`).

- **README.md** — Project overview, quickstart, useful links.

- **components.json** — Config for shadcn/ui component generator.

- **eslint.config.mjs** — ESLint rules (TS/React/Next).

- **middleware.ts (root)** — Global Next.js middleware (e.g., i18n, redirects).
  → Runs before `app/`.

- **next.config.ts / next-env.d.ts** — Next.js & TypeScript configs.

- **package.json / pnpm-lock.yaml** — Dependencies & scripts.
  → Project is PNPM-first.

- **postcss.config.mjs** — Tailwind/PostCSS pipeline config.

- **tsconfig.json** — TypeScript config, path aliases, strict mode.

---

# app/ (Next.js App Router)

**Purpose**: Handles routing, layouts, error boundaries, and providers.

- **app/layout.tsx** — Root layout (html, body, theme, fonts).
- **app/error.tsx / global-error.tsx** — Error boundaries.
- **app/unauthorized.tsx** — Generic 401 page.
- **app/favicon.ico / icon.png / apple-icon.png** — PWA icons.
- **app/sitemap.tsx / manifest.ts** — SEO + PWA manifest.

## Internationalization & segments

- **app/[locale]/** — Locale-based segment (`en`, `fr`, …).
  - **(landing)/page.tsx** — Landing page per locale.
  - **(layout)/…** — Shared static pages:
    - **about/page.tsx** — About page
    - **legal/privacy/page.tsx** — Privacy policy
    - **legal/terms/page.tsx** — Terms & conditions
    - **news/** — News listing and detail:
      - **page.tsx** — Listing
      - **[slug]/page.tsx** — Single article
      - **loading.tsx / error.tsx / not-found.tsx** — States
      - **newsSlugMetadataImage.tsx** — Dynamic OG image

    - **not-found/page.tsx** — Segment-specific 404

  - **(logged-in)/** — Protected pages after auth:
    **error.tsx / not-found.tsx / unauthorized.tsx** — States
  - **@modal/** — Parallel route slot for modals:
    **[...catchAll]/page.tsx** + **default.tsx** — “Intercepted routes” pattern
  - **docs/** — Documentation UI:
    - **layout.tsx / page.tsx** — Docs shell
    - **[slug]/page.tsx** — Dynamic doc pages
    - **\_components/doc-sidebar.tsx** — Docs sidebar
    - **doc-manager.ts** — Loader/parsing logic

  - **globals.css** — Global styles (reset, design tokens)
  - **layout.tsx / providers.tsx / not-found.tsx** — Locale-level layout & context

---

# content/ (Editorial content)

- **content/news/en|fr/\*.mdx** — News articles (per language).
  → Parsed and displayed via `features/news`.

---

# public/ (Static assets)

- **public/images/** — Static images (logos, backgrounds, illustrations).
- **public/\*.svg** — Icons/illustrations (e.g., news categories).
  → Served directly (`/images/...`).

---

# messages/ (i18n dictionaries)

- **en.json / fr.json** — Translation keys.
  → Consumed by `src/i18n` + UI components (`LocaleSwitcher`).

---

# docker/

- **Dockerfile.dev / Dockerfile.prod** — Dev vs production Next.js images.
- **docker-compose.yml** — Local/preview orchestration.

---

# src/ (Application code)

## src/components/ (Reusable UI)

- **DS/** — DyingStar Design System (custom components):
  - **layout/** — Layouts (header, footer, base)
  - **CTA/** — Call-to-action blocks
  - **legal/** — Floating legal footer
  - Utilities: **divider.tsx, grid-background.tsx, loader.tsx, logo.tsx, typography.tsx**

- **ui/** — shadcn/ui components (buttons, inputs, modals, tables, tabs, etc.).
- **svg/** — React components for SVGs.
- **utils/** — Visual helpers (`tailwind-indicator`, `intercept-dialog`).

## src/features/ (Vertical features)

- **dialog-manager/** — Global dialog system (store, factory, renderer, types).
- **form/** — Form UX (auto-save, submit button).
- **global-dialog/** — Global dialogs + store (e.g., org plan modal).
- **i18n/** — Language switcher UI.
- **landing/** — Landing page sections (CTA, layout).
- **markdown/** — Markdown/MDX rendering (client/server, config).
- **navigation/** — Navigation model & rendering (links, wrapper, types).
- **news/** — News feature (items, reading time, manager).
- **page/** — Error/state pages + top loader.
- **server-sonner/** — Server-to-client toasts.

## src/hooks/

Cross-cutting React hooks:

- **useDebounceFn**, **useIsClient**, **useMobile**, **useWarnIfUnsavedChanges**, **useCurrentPath**.

## src/i18n/

- **config.ts / routing.ts / navigation.ts / request.ts** — Core i18n utilities (locale detection, localized routes, helpers).

## src/lib/

- **actions/** — Safe server actions (`safe-actions.ts`, utils).
- **env/** — Zod validation for environment variables (client & server).
- **errors/** — App error types (ActionError, ApplicationError, ZodRouteError).
- **format/** — Helpers (date, display-name, id).
- **logger.ts** — Logging utility.
- **metadata.ts** — Page metadata generator (SEO/OG).
- **server-toast.tsx** — Bridge server → client toasts.
- **server-url.ts** — Server-side base URL.
- **utils.ts** — General utilities.
- **zod-route.ts** — Route schema/validation.

## src/middleware.ts

Additional middleware specific to `src` (if not root).

## src/site-config.ts

Central site configuration (name, links, social, feature flags).

## src/types/

- **next.ts** — Next.js custom/extended types.

---

# Docs pipeline (summary)

- **content/news/** (MDX) → **features/markdown** (parsing) → **features/news/news-manager.ts** (loading, mapping, reading time) → **app/[locale]/(layout)/news/** (UI pages).
