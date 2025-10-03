# DyingStar Website

## Local Development

### Requirements
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Make](https://www.gnu.org/software/make/) to use the provided Makefile (optional but recommended)

### Setup
1. Copy `.env.example` to `.env.local` and fill in the required environment variables
2. Run `make dev` to start the development server. This will install dependencies and start the server.
3. Open your browser and navigate to `http://localhost:3000` to see the website.
4. To stop the development server, stop the Docker container with `Ctrl+C` in the terminal where `make dev` was run.

### Notes
- The development server supports hot-reloading, so any changes you make to the code will automatically be reflected in the browser.
- If you need to install new dependencies, you can do so by running `make add-dependency <package-name>` or `make add-dev-dependency <package-name>` for dev dependencies.

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/build.yml`.

### Stages

1. **Next.js Build**: This stage installs dependencies, lints the code, and builds the Next.js application.
2. **Docker Build and Push**: This stage builds a Docker image of the application and pushes it to the registry. The push is triggered only on the `main` branch with a tag starting with `v`.
 
### Environment Variables
- The workflow expects a secret named `WEBSITE_ENV_PRODUCTION_FILE` containing the contents of the `.env.production` file. This file is created during the CI process to ensure that sensitive information is not hardcoded in the repository
