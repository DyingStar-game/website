# [DyingStar - Webapp] Tools

Please install following tools

| Tool                              | Version           | Required |
| --------------------------------- | ----------------- | -------- |
| [Node.js](https://nodejs.org/en)  | 22.14.0 or higher | Yes      |
| [Docker](https://www.docker.com/) | 28.4.0 or higher  | Yes      |
| [Docker](https://www.docker.com/) | 28.4.0 or higher  | Yes      |
| [Git](https://git-scm.com/)       | 2.50.0 or higher  | Yes      |
| [pnpm](https://pnpm.io/)          | 10.0.0 or higher  | Yes      |

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

1. Copy `.env.example` to `.env.local` and fill in the required environment variables
2. Run `make dev` to start the development server. This will install dependencies and start the server.
3. Open your browser and navigate to `http://localhost:3000` to see the website.
4. To stop the development server, stop the Docker container with `Ctrl+C` in the terminal where `make dev` was run.

## Notes

- The development server supports hot-reloading, so any changes you make to the code will automatically be reflected in the browser.
- If you need to install new dependencies, you can do so by running `make add-dependency <package-name>` or `make add-dev-dependency <package-name>` for dev dependencies.

## Environment Variables

- The workflow expects a secret named `WEBSITE_ENV_PRODUCTION_FILE` containing the contents of the `.env.production` file. This file is created during the CI process to ensure that sensitive information is not hardcoded in the repository
