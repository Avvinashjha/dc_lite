# Git Workflow Guide

A practical guide to using Git effectively in your projects.

## Basic Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/my-new-feature
```

### 2. Make Changes and Commit

```bash
git add .
git commit -m "feat: add new feature"
```

### 3. Push and Create PR

```bash
git push origin feature/my-new-feature
```

Then create a Pull Request on GitHub.

## Commit Message Convention

Use conventional commits for clear history:

```
type(scope): description

feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Formatting, missing semicolons, etc.
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance tasks
```

### Examples

```bash
git commit -m "feat(auth): add login functionality"
git commit -m "fix(api): handle null response"
git commit -m "docs: update installation guide"
```

## Branching Strategy

```
main          ─────────────────────────────────
                \           /         \       /
feature/auth     ─────────            \     /
                            \          \   /
feature/dashboard            ───────────────
```

- `main` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

## Useful Commands

```bash
# View commit history
git log --oneline --graph

# Stash changes
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View changes
git diff

# Interactive rebase
git rebase -i HEAD~3
```
