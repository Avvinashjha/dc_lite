# Git and Version Control

Git is the history of your React project. Deployment platforms, CI pipelines, code reviews, rollbacks, and release notes all depend on a clean version control workflow.

For React teams, Git is not only about saving code. It is how you prove what changed, when it changed, and whether the deployed app matches the reviewed code.

## What to Commit

Commit source files, configuration, tests, and documentation.

Usually commit:

- `src` or `app` code
- public assets
- `package.json`
- lockfiles such as `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`
- build configuration
- test files
- README and deployment notes

Usually do not commit:

- `node_modules`
- production build output such as `dist` or `build`, unless your host specifically requires it
- `.env` files containing secrets
- local editor caches
- coverage output
- temporary logs

A useful `.gitignore` section for React projects:

```gitignore
node_modules
dist
build
.env
.env.local
coverage
.DS_Store
```

## Commit Size

Good commits are small enough to review and large enough to make sense.

Examples:

- `Add checkout form validation`
- `Fix stale cart total after item removal`
- `Move API base URL into deployment config`

Avoid commits like:

- `changes`
- `final`
- `fix stuff`
- one giant commit containing routing, styling, state refactors, dependency upgrades, and deployment changes

## Branching Workflow

A common beginner-friendly workflow:

1. Keep `main` deployable.
2. Create a feature branch.
3. Commit focused changes.
4. Open a pull request.
5. Run CI checks.
6. Merge after review.
7. Deploy from the protected branch.

Example:

```bash
git switch -c feature/weather-search
git add src
git commit -m "Add weather search flow"
git push -u origin feature/weather-search
```

## Pull Request Checklist

Before asking for review:

- The app builds.
- Tests pass.
- New behavior is described clearly.
- Screenshots or recordings are included for UI changes.
- Environment variables are documented.
- Risky changes have manual test notes.
- Unrelated formatting churn is avoided.

For React apps, reviewers should pay special attention to state ownership, effect dependencies, user-visible errors, accessibility, and deployment behavior.

## Tags and Releases

Tags mark important versions.

```bash
git tag v1.0.0
git push origin v1.0.0
```

Tags are useful when:

- deploying a specific release
- comparing production to a previous version
- creating rollback points
- generating release notes

Use a consistent versioning scheme. For learning projects, `v1.0.0`, `v1.1.0`, and `v1.1.1` are enough.

## Rollbacks

A rollback restores users to a known working version.

Common rollback options:

- revert the bad commit
- redeploy the previous successful build
- roll back to a previous hosting deployment
- disable the feature with a remote flag if your app supports it

Prefer `git revert` when you need a clear history:

```bash
git revert <commit-sha>
```

Avoid rewriting shared history unless your team explicitly agrees.

## Lockfiles Matter

Lockfiles make installations reproducible.

If CI installs different dependency versions than your laptop, the app may build or behave differently. Commit the lockfile and use the matching package manager in CI.

Example:

```bash
npm ci
```

`npm ci` installs exactly from `package-lock.json` and is better for CI than `npm install`.

## Common Mistakes

- Committing `.env` files with private values.
- Forgetting to commit the lockfile.
- Deploying from a local machine instead of a reviewed branch.
- Combining unrelated changes in one pull request.
- Force-pushing over teammates' work.
- Assuming `main` works without a build check.
- Leaving generated files in commits by accident.

## Edge Cases

Monorepos:

Make sure your deployment platform builds the correct package directory and uses the correct install command.

Generated clients:

If an API client is generated from a schema, decide whether generated files are committed or generated in CI. Be consistent.

Emergency fixes:

For urgent production bugs, create a small branch from the deployed commit, fix only the bug, and deploy through the same checks when possible.

:::quiz
question: Why should a React app usually commit its package lockfile?
options:
  - It makes dependency installation more reproducible across machines and CI.
  - It stores production environment variables securely.
  - It replaces the need for tests.
  - It prevents all dependency vulnerabilities.
answer: 0
explanation: A lockfile records exact dependency versions so installs are predictable across local development and deployment environments.
:::

## Practice Challenge

Create a release workflow for a small React app.

Tasks:

- add a `.gitignore` appropriate for the project
- create a feature branch
- make two focused commits
- write a pull request checklist in the README
- tag a version after merging
- write a rollback note explaining how to restore the previous version

## Recap

Git supports deployment by giving your team traceable, reviewable, reproducible changes. A React project with clean commits, committed lockfiles, protected branches, and clear rollback points is much easier to ship safely.
