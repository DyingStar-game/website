########### TODO ###########

# Release and Deployment Process

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment. The workflow is defined in `.github/workflows/build.yml`.

### Stages

1. **Next.js Build**: This stage installs dependencies, lints the code, and builds the Next.js application.
2. **Docker Build and Push**: This stage builds a Docker image of the application and pushes it to the registry. The push is triggered only on the `main` branch with a tag starting with `v`.
