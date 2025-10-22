# [DyingStar - Webapp] Webapp Architecture

## Architecture Decision Records

All ADRs are stored in the [ADR](./ADR) folder and referenced in the [ADRs.md](./ADRs.md) file.

## Technologies

The list of technologies we will use to build the application are as follows:

| Technology                       | Description               | Version  |
| -------------------------------- | ------------------------- | -------- |
| [Next.js]                        | Base framework            | 15.5.3   |
| [React]                          | UI library                | 19.1.1   |
| [TypeScript]                     | Type safety               | 5.9.2    |
| [pnpm]                           | Package manager           | 10.17.1  |
| [@t3-oss/env-nextjs]             | Environment variables     | 0.13.8   |
| [Tailwind CSS]                   | Styling                   | 4.1.13   |
| [tailwind-merge]                 | Merge Tailwind classes    | 3.3.1    |
| [class-variance-authority]       | Component variants        | 0.7.1    |
| [clsx]                           | Conditional classnames    | 2.1.1    |
| [Radix UI]                       | Headless UI components    | Various  |
| [lucide-react]                   | Icon library              | 0.542.0  |
| [cmdk]                           | Command menu              | 1.1.1    |
| [better-auth]                    | Authentication            | 1.3.8    |
| [next-intl]                      | Internationalization      | 4.3.9    |
| [@tanstack/react-query]          | Server state management   | 5.87.1   |
| [@tanstack/react-query-devtools] | React Query DevTools      | 5.87.1   |
| [Zustand]                        | Client state management   | 5.0.8    |
| [Zod]                            | Schema validation         | 4.1.5    |
| [react-hook-form]                | Form management           | 7.62.0   |
| [@hookform/resolvers]            | Form validation resolvers | 5.2.1    |
| [Framer Motion]                  | Animations                | 12.23.15 |
| [motion]                         | Animation library         | 12.23.12 |
| [next-safe-action]               | Type-safe server actions  | 8.0.11   |
| [next-themes]                    | Theme management          | 0.4.6    |
| [next-zod-route]                 | Zod route validation      | 1.0.0    |
| [next-mdx-remote-client]         | MDX rendering             | 2.1.3    |
| [Shiki]                          | Syntax highlighting       | 3.12.2   |
| [recharts]                       | Data visualization        | 3.1.2    |
| [tslog]                          | Logging                   | 4.9.3    |
| [sonner]                         | Toast notifications       | 2.0.7    |
| [nprogress]                      | Progress bar              | 0.2.0    |
| [nuqs]                           | URL state management      | 2.6.0    |
| [date-fns]                       | Date utilities            | 4.1.0    |
| [nanoid]                         | Unique ID generation      | 5.1.5    |
| [up-fetch]                       | HTTP client               | 2.4.0    |
| [react-hotkeys-hook]             | Keyboard shortcuts        | 5.1.0    |
| [react-use]                      | React hooks collection    | 17.6.0   |
| [markdown-to-jsx]                | Markdown to JSX           | 7.7.13   |
| [front-matter]                   | Front matter parser       | 4.0.2    |
| [rehype-autolink-headings]       | Auto-link headings        | 7.1.0    |
| [rehype-slug]                    | Add slugs to headings     | 6.0.0    |
| [remark-gfm]                     | GitHub Flavored Markdown  | 4.0.1    |
| [sass]                           | CSS preprocessor          | 1.92.1   |
| [styled-jsx]                     | CSS-in-JS                 | 5.1.7    |
| [ESLint]                         | Linting                   | 9.35.0   |
| [Prettier]                       | Code formatting           | 3.6.2    |

## Non-functional Requirements

Non-functional requirement for the project are:

| Quality Attribute | Description                                                                                                                                                                         | Target                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Performance       | Transaction Response Time                                                                                                                                                           | 2 seconds                                                  |
| Availability      | System Uptime                                                                                                                                                                       | 99.9                                                       |
| Throughput        | Number of requests/transactions per second at peak time                                                                                                                             | 1000 RPS                                                   |
| Auditability      | Ability of the application to show what has happened to it, who did it and when                                                                                                     | A log file that captures the event with the timestamp      |
| Reliability       | Mean time to recovery                                                                                                                                                               | System should be able to recover from failure under 5 mins |
| Usability         | Usability can be described as the capacity of a system to provide a condition for its users to perform the tasks safely, effectively, and efficiently while enjoying the experience | Browsers: Chrome, IE, Firefox                              |

## Services

The list of services we will use to build the application are as follows:

| Service       | Description   | Version |
| ------------- | ------------- | ------- |
| [Meilisearch] | Search engine | 1.0.0   |

TODO : Crée un HLD pour les services

## Project Structure Documentation

The project structure is documented in multiple files for better organization:

- **[FolderStructure.md](./FolderStructure.md)** — High-level architecture overview, key concepts, and folder organization
- **[ProjectTreeFolder.md](./ProjectTreeFolder.md)** — Complete file-by-file breakdown of the entire repository
- **[FileTypes.md](./FileTypes.md)** — Detailed file naming conventions and patterns
