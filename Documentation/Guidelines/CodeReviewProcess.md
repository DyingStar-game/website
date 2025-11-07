# Code Review Process

This document describes the complete code review process for the DyingStar project, from creating a feature to deploying to staging.

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Development Process](#development-process)
- [Before Creating the Pull Request](#before-creating-the-pull-request)
- [Creating the Pull Request](#creating-the-pull-request)
- [Automated CI/CD Pipeline](#automated-cicd-pipeline)
- [Review Process](#review-process)
- [Merge and Deployment](#merge-and-deployment)
- [Quick Checklist](#quick-checklist)

## Introduction

The DyingStar project uses the **git-flow** model to manage development. All development is done in feature branches, which are then merged into `develop` via Pull Request after validation.

The code review process ensures code quality, architectural consistency, and adherence to best practices before a change is integrated.

> 📖 More information on git-flow: [DevelopmentProcess Documentation](./DevelopmentProcess.md)

## Prerequisites

Before starting development:

1. **Get issue details** from GitHub Projects
2. **Ask your questions** to the Website Lead on Discord in the post linked to the issue
3. **Request assignment** of the issue from the Website Lead
4. **Fully understand the requirements** listed in the issue (Design, Frontend, Backend, Integration)

## Development Process

### 1. Update the `develop` branch

Make sure you have the latest version of `develop`:

```bash
git checkout develop
git pull origin develop
```

### 2. Create the feature branch

Create your branch following the naming convention:

```bash
git checkout -b feat/{issue-number}-{ShortIssueName}
```

**Examples:**

- `feat/123-AddUserProfile`
- `fix/456-FixLoginBug`

### 3. Development

Develop the features according to the issue requirements.

**Best practices:**

- Make regular commits with clear messages
- Test your changes locally with `make up` then `make pnpm dev`
- Follow the project's code conventions

## Before Creating the Pull Request

### 1. Synchronization with `develop`

Before creating your PR, synchronize your branch with `develop` to avoid conflicts:

```bash
git pull origin develop
```

If conflicts appear, resolve them locally and test that everything works.

### 2. Mandatory local checks

Before pushing, run the following commands to ensure your code meets the standards:

#### a) Clean (Lint + Typecheck + Prettier)

```bash
make pnpm clean
```

This command executes:

- `eslint . --fix`: Analyzes and automatically fixes lint errors
- `tsc --noEmit`: Checks TypeScript types without generating files
- `prettier --write .`: Formats the code according to project rules

#### b) Build

```bash
make pnpm build
```

This command compiles the Next.js application with Turbopack. The build must succeed without errors.

> ⚠️ **Important**: These two steps are **mandatory** before creating a PR. If the build fails, do not create the PR.

### 3. Commit and push

Once all checks pass:

```bash
git add .
git commit -m "feat: description of your feature"
git push origin feat/{issue-number}-{ShortIssueName}
```

## Creating the Pull Request

### 1. Open the Pull Request on GitHub

- Go to the GitHub repository
- Click on "Compare & pull request" or create a new PR
- **Base branch**: `develop`
- **Compare branch**: your feature branch

### 2. Fill in the PR description

A good description should contain:

**Title:**

- Format: `[#{issue-number}] Short feature title`
- Example: `[#123] Add user profile page`

**Description:**

```markdown
## Context

Describe the context and objective of this PR.

## Changes

- List of main modifications
- New features added
- Bugs fixed

## Screenshots (if applicable)

Add screenshots for UI changes

## Requirements Checklist

- [ ] Design: [description if applicable]
- [ ] Frontend: [description]
- [ ] Backend: [description]
- [ ] Integration: [description]

## Tests Performed

- [ ] Local tests OK
- [ ] Build successful
- [ ] Lint/Typecheck/Prettier OK
```

### 3. Link the GitHub issue

In the PR description, add:

```markdown
Closes #123
```

This will automatically link the issue to the PR and close it upon merge.

### 4. Verify the requirements

Make sure you have addressed **all requirements** listed in the original issue:

- ✅ Design
- ✅ Frontend
- ✅ Backend
- ✅ Integration (CI/CD, observability, documentation)

## Automated CI/CD Pipeline

As soon as the PR is created, **GitHub Actions** automatically triggers to validate your code.

### Pipeline steps

The pipeline executes the following steps (defined in `.github/workflows/build.yml`):

1. **Environment setup**
   - Node.js 22
   - pnpm (version from `package.json`)
   - Dependency cache

2. **Install dependencies**

   ```bash
   pnpm install --frozen-lockfile
   ```

3. **Type generation**

   ```bash
   pnpm type:generate
   ```

4. **Lint CI**

   ```bash
   pnpm lint:ci
   ```

   This command executes:
   - `eslint . --max-warnings 0`: Lint with zero tolerance for warnings
   - `tsc --noEmit`: Type checking
   - `prettier --check .`: Format checking (without modification)

5. **Build Next.js**

   ```bash
   pnpm build
   ```

6. **Build Docker Image** (without push for PRs)

### Check the pipeline status

- The pipeline status is displayed directly in the PR
- ✅ **Checks passed**: All tests are OK, the PR can be reviewed
- ❌ **Checks failed**: Errors have been detected, you must fix them

> ⚠️ **Important**: A PR can only be merged if all checks are green.

### In case of failure

If the pipeline fails:

1. Check the detailed logs in the "Checks" tab of the PR
2. Fix the errors locally
3. Re-run `make pnpm clean` and `make pnpm build`
4. Commit and push the fixes
5. The pipeline will rerun automatically

## Review Process

### 1. Notification

Once the PR is created and checks have passed, **notify the team on Discord**:

```
🔔 PR ready for review: [PR Link]
Issue: #123 - Issue title
```

### 2. Review by another developer (recommended)

Another developer can perform a review for:

**Review criteria:**

- ✅ **Code quality**: Readability, variable/function naming
- ✅ **Architecture**: Respect for project patterns
- ✅ **Performance**: No unnecessary blocking code
- ✅ **Security**: No obvious vulnerabilities
- ✅ **Documentation**: Comments / Documentation.md if necessary

The reviewer can:

- ✅ **Approve** the PR if everything is OK
- 💬 **Comment** to request clarifications
- ❌ **Request changes** if corrections are needed

### 3. Mandatory review by the Website Lead

The **Website Lead** must review and approve the PR before merge.

They verify:

- Compliance with issue requirements
- Consistency with overall architecture
- Alignment with project vision

### 4. Address review comments

If changes are requested:

1. Make the requested modifications
2. Re-run `make pnpm clean` and `make pnpm build`
3. Commit and push
4. Respond to review comments
5. Re-request review if necessary

## Merge and Deployment

### 1. Final approval

Once all reviews are passed and approved:

- ✅ All GitHub Actions checks are green
- ✅ At least one approval from the Website Lead
- ✅ All review comments are resolved

### 2. Merge into `develop`

**Only the Website Lead can merge the PR.**

The merge is done via the GitHub interface:

1. Click on "Merge pull request"
2. Choose the merge type (usually "Squash and merge")
3. Confirm the merge

### 3. Automatic deployment to staging

As soon as the code is merged into `develop`, **GitHub Actions automatically triggers** the staging deployment:

**Deployment pipeline:**

1. **Application build** (job `build`)
2. **Docker image build** (job `docker-image`)
   - Tag: `ghcr.io/dyingstar-game/website:staging`
   - Tag: `ghcr.io/dyingstar-game/website:staging-{sha}`
3. **Image push** to GitHub Container Registry (GHCR)
4. **SSH deployment** (job `deploy`)
   - Connection to staging server
   - Pull of new Docker image
   - Container restart via `docker-compose`

**Estimated duration:** 5-10 minutes

### 4. Staging verification

After deployment:

1. **Wait** for the deployment pipeline to finish (green checks)
2. **Verify** that the application works on the staging environment
3. **Test** your feature on staging
4. **Report** any issues to the Website Lead

## Quick Checklist

Use this checklist to make sure you don't forget anything:

### Before developing

- [ ] Issue read and understood
- [ ] Issue assignment obtained
- [ ] `develop` branch up to date
- [ ] Feature branch created with correct convention

### During development

- [ ] Code developed according to requirements
- [ ] Local tests performed
- [ ] Regular commits with clear messages

### Before the PR

- [ ] Merge of `develop` into my branch
- [ ] Conflicts resolved (if applicable)
- [ ] `make pnpm clean` executed successfully ✅
- [ ] `make pnpm build` executed successfully ✅
- [ ] Code committed and pushed

### Creating the PR

- [ ] PR created with complete description
- [ ] Issue linked with `Closes #xxx`
- [ ] All issue requirements addressed
- [ ] Screenshots added (if UI)
- [ ] Team notified on Discord

### After the PR

- [ ] GitHub Actions pipeline green ✅
- [ ] Review comments addressed
- [ ] Website Lead approval obtained
- [ ] PR merged by Website Lead
- [ ] Staging deployment verified

---

## Useful Resources

- [Git-flow model](https://nvie.com/posts/a-successful-git-branching-model/)
- [Development Process Documentation](./DevelopmentProcess.md)
- [Architecture Documentation](./architecture/Architecture.md)
- [Makefile commands](../../Makefile)

---

**Questions?** Contact the Website Lead on Discord 💬
