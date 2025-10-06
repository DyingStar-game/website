# [DyingStar - Webapp] Webapp Architecture

## Technologies

The list of technologies we will use to build the application are as follows:

| Technology                 | Description           | Version  | ADR if available |
| -------------------------- | --------------------- | -------- | ---------------- |
| [Next.Js]                  | Base framework        | [11.0.9] |                  |
| [t3-oss]                   | Environment variables | [13.1]   |                  |
| [TailwindCss]              | Styling               | [2.4.1]  |                  |
| [class-variance-authority] |                       | [17.0.1] |                  |
| [clsx]                     |                       | [17.0.1] |                  |

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

## Folder and File structure

The folder structure of repository is as follows: [tree](./projectTreeFolder.md)

### Logic structure of folders

#############
TODO :
Il faudrait reprendre la doc de nextjs pour la structure des folders
Ajouter des liens pour chaques folders
#############

### Files Types and conventions

- **\*.mdx** - utiliser pour les pages ayant du rendu markdown exemple : news + links
- **\*.ts** - Fichier de logique pure
- **\*.type.ts** - Permet de définir des types et schema avec zod
- **\*.hook.ts** - Permet de définir des hooks react qui ne sont pas implicitement dans le dossier hooks
- **\*.link.ts** - Logique localisée des liens de navigation
- **\*.query.ts** - query prisma
- **\*query.hook.ts** - query tanstack
- **\*mutation.hook.ts** - mutation tanstack
- **\*.tsx** - Fichier contenant les composants react
  ....

## Architecture Decision Records

All ADRs are stored in the [ADR](./ADR) folder and referenced in the [ADRs.md](./ADRs.md) file.
