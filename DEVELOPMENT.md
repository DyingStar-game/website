# DyingStar Website - Development Guide

This guide provides comprehensive instructions for developing the DyingStar website project.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Development Profiles](#development-profiles)
- [Environment Setup](#environment-setup)
- [Available Commands](#available-commands)
- [Development Workflow](#development-workflow)
- [News Sync from Discord](#news-sync-from-discord)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Quick Start

### For CP/PO/Others (Just want to test the site)

```bash
# Clone the repository
git clone https://github.com/DyingStar-game/website.git
cd dyingstar-website

# Start the complete application (installs, builds, and starts)
make start

# Visit http://localhost:3000
```

### For Developers

```bash
# Clone the repository
git clone https://github.com/DyingStar-game/website.git
cd dyingstar-website

# Start development environment (MeiliSearch + dev container)
make up

# Install dependencies
make pnpm install

# Start development server
make pnpm dev

# Visit http://localhost:3000
```

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Make** utility (usually pre-installed on macOS/Linux)
- **Git** for version control
- A `.env.local` file (copy from `.env.sample` if available)

> **Note:** You don't need Node.js or pnpm installed locally! Everything runs in Docker containers.

## 🏗️ Project Structure

```
dyingstar-website/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── src/
│   ├── components/        # Reusable React components
│   ├── features/          # Feature-specific modules
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   └── types/             # TypeScript type definitions
├── content/               # MDX content files
├── messages/              # i18n message files
├── public/                # Static assets
├── docker/                # Docker configuration
│   └── docker-compose.yml # Multi-service setup
├── Makefile              # Development commands
└── package.json          # Dependencies and scripts
```

## 👥 Development Profiles

The project supports different user profiles with tailored commands:

### 🎯 **CP/PO/Others Profile** (Simple Testing)

_For product owners, stakeholders, or anyone who just wants to test the site_

**Key Commands:**

- `make start` - One-command setup: install → build → start
- `make stop` - Stop everything

**Use Case:** Quick site testing without development setup complexity.

### 🔧 **Dev Profile** (Development Work)

_For developers working on the codebase_

**Key Commands:**

- `make up` - Start development environment (MeiliSearch only)
- `make pnpm <command>` - Run any pnpm command

**Use Case:** Active development with full control over the development environment.

## 🔧 Environment Setup

### 1. Environment Variables

```bash
# Copy the sample environment file
cp .env.sample .env.local

# Edit with your configuration
nano .env.local  # or use your preferred editor
```

### 2. Required Environment Variables

```env
# MeiliSearch Configuration
MEILI_URL=http://localhost:7700
MEILI_MASTER_KEY=your_master_key_here

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# GitHub Integration (optional)
NEXT_PUBLIC_GITHUB_REPO=your_repo_name
GITHUB_TOKEN=your_github_token

# Discord Integration (optional)
NEXT_PUBLIC_DISCORD_INVITE_ID=your_NEXT_PUBLIC_DISCORD_INVITE_ID

# YouTube Integration (optional)
LAST_YOUTUBE_ID=your_youtube_id
```

## 📝 Available Commands

### **CP/PO/Others Profile**

| Command      | Description                            |
| ------------ | -------------------------------------- |
| `make start` | Start complete application for testing |
| `make stop`  | Stop all services                      |
| `make help`  | Show all available commands            |

### **Dev Profile**

| Command           | Description                   |
| ----------------- | ----------------------------- |
| `make up`         | Start development environment |
| `make down`       | Stop development environment  |
| `make pnpm <cmd>` | Run any pnpm command          |

### **pnpm Commands via Docker**

| Command                      | Description              |
| ---------------------------- | ------------------------ |
| `make pnpm install`          | Install dependencies     |
| `make pnpm dev`              | Start Next.js dev server |
| `make pnpm build`            | Build for production     |
| `make pnpm start`            | Start production server  |
| `make pnpm lint`             | Run linter               |
| `make pnpm clean`            | Clean + format code      |
| `make pnpm add <package>`    | Add new dependency       |
| `make pnpm remove <package>` | Remove dependency        |

### **Utility Commands**

| Command                 | Description                 |
| ----------------------- | --------------------------- |
| `make logs`             | Show logs for all services  |
| `make logs-app`         | Show app logs only          |
| `make logs-meilisearch` | Show MeiliSearch logs       |
| `make shell`            | Open shell in dev container |
| `make status`           | Show service status         |

## 🔄 Development Workflow

### **Standard Development Flow**

1. **Start Development Environment**

   ```bash
   make up
   ```

2. **Install Dependencies** (first time or after package.json changes)

   ```bash
   make pnpm install
   ```

3. **Start Development Server**

   ```bash
   make pnpm dev
   ```

4. **Code & Test**
   - Edit files in your preferred editor
   - Changes auto-reload thanks to Next.js hot reload
   - Access the site at http://localhost:3000
   - MeiliSearch admin at http://localhost:7700

5. **Code Quality Checks**

   ```bash
   # Run linter
   make pnpm lint

   # Format code
   make pnpm format

   # Or do both
   make pnpm clean
   ```

6. **Build & Test Production**
   ```bash
   make pnpm build
   ```

### **Adding New Dependencies**

```bash
# Add runtime dependency
make pnpm add package-name

# Add development dependency
make pnpm add -D package-name

# Remove dependency
make pnpm remove package-name
```

### **Working with Features**

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop Feature**

   ```bash
   make up           # Start environment
   make pnpm dev     # Start dev server
   # ... develop your feature ...
   make pnpm clean        # Format & lint before commit
   ```

3. **Test Production Build**

   ```bash
   make pnpm build        # Ensure production build works
   ```

4. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## 📰 News Sync from Discord

News articles live in `content/fr/news/` (French, source language) and `content/en/news/` (English translation), linked by the `alternates` frontmatter field. The `pnpm news:sync` script imports the posts of the Discord **#news** channel, cleans them into MDX with a generated frontmatter (title, description, tags, icon), and writes the English translation. The generation runs through [Claude Code](https://claude.com/claude-code) in headless mode (`claude -p`), so it is covered by your Claude subscription — no API key needed.

### **One-time Setup**

1. **Create a Discord bot**: [discord.com/developers](https://discord.com/developers/applications) → _New Application_ → _Bot_ → _Reset Token_ → copy it as `DISCORD_BOT_TOKEN`.
2. **Enable the Message Content intent**: _Bot_ → _Privileged Gateway Intents_ → **Message Content Intent**. Without it, Discord returns empty message contents.
3. **Invite the bot**: _OAuth2_ → _URL Generator_ → scope `bot`, permissions **View Channels** and **Read Message History** → open the generated URL and add the bot to the server.
4. **Get the channel id**: Discord settings → _Advanced_ → _Developer Mode_, then right-click **#news** → _Copy Channel ID_ → `DISCORD_NEWS_CHANNEL_ID`.
5. **Claude Code**: install it and log in once (`claude` must be in your `PATH`; run `claude` and follow the login flow).
6. **Map Discord authors**: fill `scripts/news-sync/authors.ts` with the Discord user ids (right-click a user → _Copy User ID_), the `author` name used on the site and the FR/EN `authorRoles`. Unknown authors fall back to their Discord display name with no role.

Add `DISCORD_BOT_TOKEN` and `DISCORD_NEWS_CHANNEL_ID` to `.env.local` (see `.env.sample`).

### **Usage**

```bash
make news-sync ARGS="--dry-run --limit=1"   # Preview the generated MDX, write nothing
make news-sync                              # Import every new post
make news-sync ARGS="--since=2025-10-01"    # Override the start date
```

> Unlike the other commands, this one runs **on the host**, not in Docker, because it relies on your local `claude` CLI (`pnpm news:sync --dry-run --limit=1` works too). Flags must go through `ARGS`: `make news-sync --dry-run` does not work because `make` parses `--dry-run` and `--limit` as its own options.

- By default, only messages posted **after the most recent news** in `content/fr/news/` are considered, so already published history is not re-imported.
- Consecutive messages from the same author less than 10 minutes apart are merged into a single news.
- Image attachments are downloaded to `public/assets/images/news/` (`YYYYMMDD-N.ext`); the first one becomes `coverUrl`, the others are embedded in the body. Without image, `coverUrl` falls back to `/assets/images/news/sample.png`.
- Each generated FR file stores the `discordMessageId` of its source post; a post already imported is skipped on later runs.
- Generated files are only a draft: **review the diff**, adjust the wording, the tags or the cover image by hand, run `make pnpm clean`, then commit.

## 🏗️ Technology Stack

- **Framework:** Next.js 15+ with App Router
- **Bundler:** Turbopack (Next.js's new bundler)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Runtime:** Node.js 22.20.0 (LTS)
- **Search:** MeiliSearch
- **Internationalization:** next-intl
- **Content:** MDX
- **Development:** Docker + Docker Compose

## 🛠️ Troubleshooting

### **Common Issues**

#### Are you using Docker or Podman?

This project supports both Docker and Podman for container management. The Makefile automatically detects if Podman is installed and uses it for all commands. If you prefer to use Docker, ensure Podman is not installed or modify the Makefile accordingly.

> `podman > docker`

Make sure you are replacing `docker` with `podman` in all commands if you are using Podman.

#### Container Issues

```bash
# If containers won't start
make down
docker system prune -f
make up

# Check container status
make status

# View logs
make logs
```

#### Dependency Issues

```bash
# Clear node_modules and reinstall
make down
docker volume rm dyingstar-website_node_modules
make up
make pnpm install
```

#### Port Conflicts

If ports 3000 or 7700 are already in use:

```bash
# Find what's using the port
lsof -i :3000
lsof -i :7700

# Kill the process or stop conflicting services
```

#### Permission Issues

```bash
# Fix file permissions (if needed)
sudo chown -R $USER:$USER .
```

### **Environment Issues**

#### Missing .env.local

```bash
# Copy sample file
cp .env.sample .env.local

# Edit with your values
nano .env.local
```

#### MeiliSearch Connection Issues

- Ensure MeiliSearch is running: `make logs-meilisearch`
- Check environment variables in `.env.local`
- Verify port 7700 is accessible

### **Development Server Issues**

#### Hot Reload Not Working

- Ensure you're in the dev container: `make shell`
- Check file watchers aren't exceeded (Linux): `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

#### Build Failures

```bash
# Clean and rebuild
make pnpm lint:ci
make pnpm build

# Check for TypeScript errors
make pnpm typecheck
```

## 🤝 Contributing

### **Code Style**

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting (automatic with `make pnpm clean`)
- Write meaningful commit messages

### **Commit Convention**

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### **Pull Request Process**

1. Create feature branch from `main`
2. Develop feature following guidelines
3. Run `make pnpm clean` before committing
4. Test production build with `make pnpm build`
5. Create pull request with clear description
6. Ensure CI passes

### **Code Review Checklist**

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] No console.log statements in production code
- [ ] Internationalization keys are properly defined
- [ ] Responsive design is maintained
- [ ] Performance considerations are addressed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MeiliSearch Documentation](https://docs.meilisearch.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)

---

**Happy coding! 🚀**

For questions or issues, please open an issue on the GitHub repository.
