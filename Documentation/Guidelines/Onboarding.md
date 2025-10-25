# [DyingStar - Webapp] Tools

Please install following tools

| Tool                                               | Version           | Required |
| -------------------------------------------------- | ----------------- | -------- |
| [Node.js](https://nodejs.org/en)                   | 22.20.0 or higher | Yes      |
| [Docker](https://www.docker.com/)                  | 24.0.0 or higher  | Yes      |
| [Docker Compose](https://docs.docker.com/compose/) | 2.20.0 or higher  | Yes      |
| [Make](https://www.gnu.org/software/make/)         | 3.81 or higher    | Yes      |
| [Git](https://git-scm.com/)                        | 2.50.0 or higher  | Yes      |
| [pnpm](https://pnpm.io/)                           | 10.17.1 or higher | Yes      |

# Git command-line configuration

Make sure you have configured your user with Git. This information will be used by Git.

```
git config --global user.name "Your Fullname"
git config --global user.email "Your Email"
```

Windows users should use Git bash for better command-line experience. If you are not well-versed with Git then you can read the [tutorial](https://github.com/shekhargulati/git-the-missing-tutorial).

# Connecting to Github using SSH

Refer to this [link](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh) to setup SSH for your Github account.

# Get your access to the repository

Ask to the Website Lead on this [discord channel](https://discord.com/channels/1399325839665004554/1417133740810833940) to get push permissions to the repository.

# Clone the application

Clone the application using the following command.

```
git clone git@github.com:DyingStar-game/website.git
```

# Local Development

## Setup

1. Copy `.env.sample` to `.env.local` and fill in the required environment variables
2. Run `make up` to start the development environment (MeiliSearch service)
3. Run `make pnpm dev` to start the Next.js development server
4. Open your browser and navigate to `http://localhost:3000` to see the website.
5. To stop the development server, press `Ctrl+C` in the terminal where `make pnpm dev` was run.
