# Release and Deployment Process

This document describes the complete release creation and deployment process for the DyingStar project, based on the git-flow model and the GitHub Actions CI/CD pipeline.

## Table of Contents

- [Introduction](#introduction)
- [Environments](#environments)
- [Release Process](#release-process)
- [Detailed CI/CD Pipeline](#detailed-cicd-pipeline)
- [Hotfix Process](#hotfix-process)
- [Rollback and Recovery](#rollback-and-recovery)
- [Verification and Tests](#verification-and-tests)
- [Release Checklist](#release-checklist)

## Introduction

The DyingStar project uses the **git-flow** model for release and deployment management. The process is automated via GitHub Actions and ensures reliable deployments to staging and production.

### Roles and Responsibilities

**Only the Website Lead can:**

- Create releases
- Merge release branches to `main`
- Create version tags
- Trigger production deployments

### Versioning

The project uses **Semantic Versioning** (SemVer):

- `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)
- **MAJOR**: Incompatible API changes
- **MINOR**: New backwards-compatible features
- **PATCH**: Backwards-compatible bug fixes

> 📖 More information: [https://semver.org/](https://semver.org/)

## Environments

### Staging

**Trigger:** Automatic on push to the `develop` branch

**Characteristics:**

- Docker tag: `ghcr.io/dyingstar-game/website:staging`
- Secondary tag: `ghcr.io/dyingstar-game/website:staging-{sha}`
- Architecture: `linux/amd64` only
- Port: `8101` (according to `docker/staging.compose.yml`)

**Usage:**

- Testing new features
- Pre-production validation
- Demonstrations

### Production

**Trigger:** Automatic on creation of a `v*` tag (e.g., `v1.2.3`)

**Characteristics:**

- Primary Docker tag: `ghcr.io/dyingstar-game/website:v{version}`
- Secondary tag: `ghcr.io/dyingstar-game/website:prod`
- Architecture: Multi-platform (`linux/amd64`, `linux/arm64`)
- Deployment via SSH to production server

**Specifics:**

- Multi-architecture build for maximum compatibility
- Protected environment requiring approvals
- Active monitoring and alerts

## Release Process

### Prerequisites

Before creating a release, ensure that:

- ✅ All features for the release are merged into `develop`
- ✅ The staging environment is stable
- ✅ Staging tests are conclusive
- ✅ The changelog is ready

### Release Creation Steps

#### 1. Update `develop`

```bash
git checkout develop
git pull origin develop
```

#### 2. Create the release branch

Create a release branch following the naming convention:

```bash
git checkout -b release/release-1.2.3
```

> 📝 **Note**: Replace `1.2.3` with the appropriate version number according to SemVer

#### 3. Update the version number

Edit the `package.json` file and update the version:

```json
{
  "name": "dying-star",
  "version": "1.2.3",
  ...
}
```

#### 4. Prepare metadata

On this branch, only perform:

- ✅ CHANGELOG update
- ✅ Version notes addition
- ✅ Minor documentation fixes
- ✅ Small critical bugfixes discovered

❌ **No major new features**

#### 5. Local verification

Before creating the PR, run the verifications:

```bash
make pnpm clean
make pnpm build
```

#### 6. Commit and push

```bash
git add .
git commit -m "chore: prepare release 1.2.3"
git push origin release/release-1.2.3
```

#### 7. Pull Request creation

- Create a PR from `release/release-1.2.3` to `main`
- **Title**: `[Release] v1.2.3`
- **Description**:

```markdown
## Release v1.2.3

### New features

- Feature 1
- Feature 2

### Bug fixes

- Fix 1
- Fix 2

### Improvements

- Improvement 1

### Breaking Changes (if applicable)

- Breaking change 1

### Migration notes (if applicable)

Instructions for users/developers
```

- Notify the team on Discord

#### 8. Review and Approval

- The Website Lead reviews the PR
- Other developers can review (recommended)
- Address comments if necessary
- Final approval by the Website Lead

#### 9. PR Merge

**The Website Lead merges the PR into `main`:**

```
1. Merge pull request
2. Merge type: usually "Squash and merge"
3. Confirm the merge
```

#### 10. Version tag creation

Once the PR is merged into `main`:

```bash
git checkout main
git pull origin main
git tag -a v1.2.3 -m "Release 1.2.3"
git push origin v1.2.3
```

> ⚡ **Important**: Pushing the tag automatically triggers production deployment

#### 11. Merge-back to `develop`

After production deployment, merge changes back into `develop`:

```bash
git checkout develop
git pull origin develop
git merge main
git push origin develop
```

#### 12. GitHub Release creation

1. Go to GitHub → Releases → Draft a new release
2. Choose the tag `v1.2.3`
3. Title: `Release v1.2.3`
4. Description: Copy the release notes from the PR
5. Add binaries/assets if necessary
6. Publish the release

## Detailed CI/CD Pipeline

The pipeline is defined in `.github/workflows/build.yml` and consists of 3 main jobs.

### Job 1: Build Next.js

**Trigger:**

- Push to `develop`
- Push of `v*` tags
- Pull Requests to `main` or `develop`
- Manual workflow (workflow_dispatch)

**Steps:**

1. **Code checkout**

   ```yaml
   uses: actions/checkout@v4
   ```

2. **Environment setup**
   - Container: `node:22-alpine`
   - Installation of tar and jq
   - CPU: 2 cores

3. **pnpm configuration**

   ```bash
   corepack enable
   VERSION=$(jq -r '.packageManager|capture("pnpm@(?<v>.*)$").v' package.json)
   corepack prepare pnpm@${VERSION} --activate
   ```

4. **Dependency caching**
   - pnpm cache based on `pnpm-lock.yaml`
   - Next.js cache based on `next.config.ts`

5. **Dependency installation**

   ```bash
   pnpm fetch --silent
   pnpm install --frozen-lockfile --prefer-offline
   ```

6. **Allowed scripts configuration**

   ```bash
   pnpm config set allow-scripts "@parcel/watcher,@tailwindcss/oxide,esbuild,sharp"
   ```

7. **Environment files recreation**
   - `.env` from the `WEBSITE_ENV_FILE` secret
   - `.env.production` from the same secret

8. **Type generation**

   ```bash
   pnpm type:generate
   ```

9. **Lint CI**

   ```bash
   pnpm lint:ci
   ```

   This command executes:
   - `eslint . --max-warnings 0`
   - `tsc --noEmit`
   - `prettier --check .`

10. **Next.js Build**

    ```bash
    NODE_OPTIONS=--max-old-space-size=4096 pnpm build
    ```

11. **Dev dependencies cleanup**

    ```bash
    pnpm prune --prod
    ```

12. **Runtime artifact creation**

    ```bash
    tar -czf runtime.tar.gz \
      .next/standalone \
      .next/static \
      public \
      package.json \
      pnpm-lock.yaml
    ```

13. **Artifact upload**
    - Name: `next-runtime`
    - Retention: 1 day

### Job 2: Docker Image

**Dependencies:** Requires the `build` job

**Steps:**

1. **Download runtime artifact**

2. **Artifact extraction**

   ```bash
   tar -xzf artifact/runtime.tar.gz
   ```

3. **Target decision (prod/staging/none)**
   - **Production**: if `v*` tag
     - Platforms: `linux/amd64,linux/arm64`
   - **Staging**: if `develop` branch or manual workflow
     - Platforms: `linux/amd64`
   - **None**: for PRs (build only, no push)

4. **Docker tags calculation**

   **For staging:**

   ```
   Primary tag: ghcr.io/dyingstar-game/website:staging
   Secondary tag: ghcr.io/dyingstar-game/website:staging-{sha}
   ```

   **For production:**

   ```
   Primary tag: ghcr.io/dyingstar-game/website:v1.2.3
   Secondary tag: ghcr.io/dyingstar-game/website:prod
   ```

5. **Docker Buildx & QEMU Setup**
   - Buildx for multi-platform
   - QEMU if ARM64 architecture needed

6. **Push and cache policy**
   - **PR**: No push, GitHub Actions cache
   - **Staging/Prod**: Push to GHCR, registry cache

7. **GitHub Container Registry login**

   ```bash
   docker login ghcr.io -u ${{ github.actor }}
   ```

8. **Build & Push image**
   - Dockerfile: `docker/Dockerfile.prod`
   - Cache from: `ghcr.io/dyingstar-game/website:buildcache`
   - Cache to: same reference

### Job 3: Deploy

**Dependencies:** Requires the `docker-image` job

**Condition:** Only if target = `staging` or `prod`

**Environment:**

- `staging`: if `develop` branch
- `prod`: if `v*` tag

**Steps:**

1. **Checkout compose files**

2. **Compose file selection**
   - Production: `${{ secrets.COMPOSE_FILE_PROD }}`
   - Staging: `${{ secrets.COMPOSE_FILE_STAGING }}`

3. **SSH deployment**

   Connection to server via SSH with:
   - Host: `${{ secrets.SSH_HOST }}`
   - User: `${{ secrets.SSH_USER }}`
   - Key: `${{ secrets.SSH_KEY }}`
   - Port: `${{ secrets.SSH_PORT || 22 }}`

   Executed script:

   ```bash
   # Registry login
   echo "${{ secrets.GHCR_PAT }}" | docker login ghcr.io -u "${{ secrets.GHCR_USERNAME }}" --password-stdin

   # Pull new image
   cd docker
   docker compose -f {compose-file} pull --ignore-pull-failures

   # Container restart
   docker compose -f {compose-file} up -d --no-deps

   # Verification
   docker compose -f {compose-file} ps
   ```

**Total estimated duration:** 5-10 minutes

## Hotfix Process

Hotfixes are used to fix critical bugs in production that cannot wait for the next release.

### When to create a hotfix?

- ❌ Critical bug in production
- ❌ Security vulnerability
- ❌ Data loss
- ❌ Service unavailable

❌ **Do not use for:**

- Minor non-critical bugs
- New features
- Non-urgent performance improvements

## Rollback and Recovery

### Rollback Scenarios

A rollback may be necessary if:

- The deployment causes critical errors
- Features don't work as expected
- Severe performance issues appear

### Rollback Procedure

#### Option 1: Docker Rollback (Fast)

**On production/staging server:**

1. **Identify the previous stable version**

   Available Docker tags:
   - `ghcr.io/dyingstar-game/website:v1.2.2` (previous version)
   - `ghcr.io/dyingstar-game/website:v1.2.3` (current problematic version)

2. **Modify the compose file**

   SSH to the server:

   ```bash
   ssh user@server
   cd docker
   ```

   Edit the compose file (staging.compose.yml or prod.compose.yml):

   ```yaml
   services:
     app:
       image: ghcr.io/dyingstar-game/website:v1.2.2 # Stable version
   ```

3. **Restart containers**

   ```bash
   docker compose -f {compose-file} pull
   docker compose -f {compose-file} up -d --force-recreate
   docker compose -f {compose-file} ps
   ```

4. **Verify rollback**
   - Test the application
   - Check logs: `docker compose -f {compose-file} logs -f app`

**Estimated duration:** 2-5 minutes

#### Option 2: Git Rollback (Complete)

If the issue requires a complete code rollback:

1. **Create a release revert**

   ```bash
   git checkout main
   git pull origin main
   git revert -m 1 <merge-commit-sha>
   git push origin main
   ```

2. **Create a new patch tag**

   ```bash
   git tag -a v1.2.4 -m "Rollback to 1.2.2"
   git push origin v1.2.4
   ```

3. **Wait for automatic deployment**

### Recovery Procedure

After a rollback, to recover and fix:

1. **Identify the root cause**
   - Analyze logs
   - Reproduce the bug locally

2. **Create a hotfix**
   Follow the [Hotfix Process](#hotfix-process)

3. **Test thoroughly**
   - Local tests
   - Staging tests
   - Non-regression tests

4. **Redeploy**
   Create a new tag once the fix is validated

## Verification and Tests

### Pre-Release Tests

Before creating a release, verify:

#### Local Tests

```bash
# Start development environment
make up
make pnpm dev

# In another terminal, test
# - Navigation on all pages
# - Main features
# - Responsive design
```

#### Build Tests

```bash
# Clean and build
make pnpm clean
make pnpm build

# Verify there are no errors
```

#### Staging Tests

Once merged into `develop`:

1. Wait for automatic staging deployment
2. Test all new features
3. Verify existing features (non-regression)
4. Test on different browsers
5. Test responsive (mobile/tablet/desktop)

### Post-Deployment Verification

After a production deployment:

#### Immediate Verification (0-5 min)

- [ ] Site is accessible
- [ ] No 500 errors
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Main navigation works

#### In-Depth Verification (5-30 min)

- [ ] All new features work
- [ ] Existing critical features OK
- [ ] External integrations OK (GitHub, Meilisearch)
- [ ] Acceptable performance (loading times)
- [ ] No JavaScript errors in console

#### Continuous Monitoring (30 min - 24h)

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Monitor user errors
- [ ] Team and user feedback

### Verification Commands

#### Check Docker containers

```bash
# SSH to server
ssh user@server
cd docker

# Container status
docker compose -f {compose-file} ps

# Application logs
docker compose -f {compose-file} logs -f app

# Meilisearch logs
docker compose -f {compose-file} logs -f meilisearch
```

#### Check Docker images

```bash
# List images on server
docker images | grep website

# Check available tags on GHCR
# Via GitHub UI: Packages → website → View all tagged versions
```

## Release Checklist

Use this checklist to ensure a flawless release process.

### Phase 1: Preparation

- [ ] All planned features are merged into `develop`
- [ ] CHANGELOG prepared with all modifications
- [ ] Documentation updated if necessary
- [ ] Team notified of upcoming release

### Phase 2: Release Creation

- [ ] Local `develop` branch up to date
- [ ] `release/release-X.Y.Z` branch created
- [ ] Version in `package.json` updated
- [ ] CHANGELOG finalized
- [ ] `make pnpm clean` executed successfully ✅
- [ ] `make pnpm build` executed successfully ✅
- [ ] Changes committed and pushed
- [ ] PR created to `main` with complete description
- [ ] Team notified on Discord

### Phase 3: Review and Validation

- [ ] Code reviewed by at least 1 developer
- [ ] Website Lead approval obtained
- [ ] All review comments addressed
- [ ] GitHub Actions pipeline green ✅
- [ ] Final deployment confirmation obtained

### Phase 4: Merge and Tag

- [ ] PR merged into `main` by Website Lead
- [ ] Local `main` branch up to date
- [ ] Tag `vX.Y.Z` created
- [ ] Tag pushed to GitHub
- [ ] Production deployment pipeline launched

### Phase 5: Deployment

- [ ] GitHub Actions pipeline completed successfully
- [ ] Production deployment confirmed
- [ ] Immediate post-deployment verifications OK
- [ ] Site accessible and functional
- [ ] No critical errors detected

### Phase 6: Finalization

- [ ] Changes merged from `main` to `develop`
- [ ] GitHub Release created and published
- [ ] 24h monitoring activated
- [ ] Team notified of successful deployment
- [ ] Communication to users (if necessary)

### Phase 7: Follow-up (24h-48h)

- [ ] Error monitoring: no critical errors
- [ ] Stable performance
- [ ] Positive team feedback
- [ ] No rollback needed
- [ ] Post-mortem documentation if incidents

## Useful Resources

- [Git-flow model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Semantic Versioning](https://semver.org/)
- [Development Process Documentation](./DevelopmentProcess.md)
- [Code Review Documentation](./CodeReviewProcess.md)
- [GitHub Actions Workflow](.github/workflows/build.yml)
- [Makefile](../../Makefile)

---

**Questions?** Contact the Website Lead on Discord 💬
