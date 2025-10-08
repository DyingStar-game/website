# Development Process

The application is developed using the git-flow model. Developers cannot commit to **master** and **develop** branches. All features are developed in feature branches. A feature can then be merged into develop using Pull/merge request.

You can find more information about the git-flow model [here](https://nvie.com/posts/a-successful-git-branching-model/).

Here is a screenshot of the git-flow model : ![Git-flow Model](./pictures/git-flow-model.png)

All branches must be named using the following conventions :

- `feat/{issue-number}-{ShortIssueName}` : use for application new features
- `fix/{issue-number}-{ShortIssueName}` : use for fixing application bugs / issues
- `release/release-{semantic-version-number}` : use for release tasks

examples :

- feat/15469-AddNewFeature
- fix/15469-FixBug
- release/release-1.2.3

## Merging process

### Merging process for `feat` or `fix` branch into `develop` branch

_Only the Website Lead can merge the `feat` or `fix` branch into the `develop` branch_

- Get all details from the issue on github projects
- Ask the Website Lead for any questions about the issue on discord post related to the issue
- Ask the Website Lead to be assigned to the issue
- Updated the `develop` : `git pull origin develop`
- Create feature branch : `git checkout -b feat/15469-AddNewFeature`
- Develop the specified requirements
- Run the formater, linter, tests, build and make sure they are passing
- Commit and Push the code
- Create a Pull request to merge the feature branch into the `develop` branch
- Indicate on discord post that the PR is ready for review
- Address the required review comments (if any)
- Approve the PR when the code is ready to be merged by the Website Lead
- Website Lead merge the PR into the `develop` branch

### Creating hotfix process :

TODO

### Creating release process :

_Only the Website Lead can create a release_

- Updated the `develop` : `git pull origin develop`
- Create release branch : `git checkout -b release/release-1.2.3`
- Update the version number in the `package.json` file
- _On this branch: small fixes and preparation of metadata (changelog, dates, etc.). No big features_
- Update changelog, version notes, build numbers...
- Commit and Push the code
- Create a Pull request to merge the release branch into the `master` branch
- Indicate on discord post that the PR is ready for review
- Address the required review comments (if any)
- Approve the PR when the code is ready to be merged by the Website Lead
- Merge the PR into the `master` branch
- Create tag with the new version number : `git tag -a v1.2.3 -m "Release 1.2.3"`
- Push the tag : `git push origin v1.2.3`
- Merge the `master` branch into the `develop` branch
- Create a new release on github with the new version number
