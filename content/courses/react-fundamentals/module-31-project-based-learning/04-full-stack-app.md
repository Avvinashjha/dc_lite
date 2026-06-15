# Full-Stack App

A full-stack React project connects a frontend to a real backend. This is where forms, authentication, data fetching, routing, errors, optimistic UI, deployment, and security boundaries come together.

The goal is not to build a huge product. The goal is to build one complete vertical slice well.

## Project Goal

Build a full-stack issue tracker where users can sign in, create projects, create issues, update issue status, assign priority, comment on issues, and view project dashboards.

You can replace the domain with notes, recipes, job applications, habits, or support tickets. Keep the same structure: authenticated users managing records through a React UI and backend API.

## Required Features

Version one must include:

- user authentication
- protected routes
- project list
- issue list
- create issue form
- edit issue status
- delete or archive issue
- comments or activity log
- loading, empty, and error states
- backend validation
- deployed frontend and backend
- README with setup and environment variables

## Suggested Architecture

```text
frontend/
  src/
    routes/
    components/
    features/issues/
    features/projects/
    lib/api.js
    lib/auth.js

backend/
  routes/
  controllers/
  services/
  db/
  middleware/
```

If using a backend-as-a-service, such as Supabase or Firebase, document which responsibilities are handled by the platform and which are handled by your React app.

## Data Model

Example entities:

```text
User
  id
  email
  displayName

Project
  id
  ownerId
  name
  createdAt

Issue
  id
  projectId
  title
  description
  status
  priority
  createdAt
  updatedAt

Comment
  id
  issueId
  authorId
  body
  createdAt
```

Keep the first version small. Do not add teams, file uploads, notifications, and billing before the core issue flow works.

## API Contract

Write the API contract before building screens.

Example:

```text
GET /api/projects
POST /api/projects
GET /api/projects/:projectId/issues
POST /api/projects/:projectId/issues
PATCH /api/issues/:issueId
POST /api/issues/:issueId/comments
```

Each endpoint should define:

- request parameters
- request body
- success response
- validation errors
- authentication requirements

## React State Strategy

Separate server state from UI state.

Server state:

- projects
- issues
- comments
- current user

UI state:

- open modal
- selected filter
- form draft
- active tab
- toast message

For server state, use a library such as TanStack Query if available in your course path. Otherwise, write a small API layer and manage loading and error states carefully.

## Milestones

1. Define the project scope and data model.
2. Build backend health check.
3. Add authentication.
4. Create protected frontend routes.
5. Implement project CRUD.
6. Implement issue create and list.
7. Implement issue status updates.
8. Add comments or activity log.
9. Add validation and error messages.
10. Add loading and empty states.
11. Write tests for critical flows.
12. Deploy frontend and backend.
13. Test the deployed app from a fresh account.

## Acceptance Criteria

- Unauthenticated users cannot access protected routes.
- Users cannot read or modify another user's private data.
- Required fields are validated on both frontend and backend.
- Failed API calls show recoverable UI.
- Refreshing a protected route preserves the session or redirects clearly.
- Issue status changes update the UI and persist after refresh.
- The README lets another developer run the app locally.
- Production environment variables are documented without exposing secrets.

## Edge Cases

Test these:

- expired session
- backend unavailable
- slow API response
- empty project
- project deleted while viewing its issues
- invalid issue id in the URL
- duplicate form submission
- user opens the same issue in two tabs
- validation error returned from backend

## Common Mistakes

- Trusting frontend route guards as the only security layer.
- Building many screens before one complete API flow works.
- Mixing API calls directly into every component.
- Showing generic "something went wrong" for every error.
- Forgetting loading and empty states.
- Storing authentication tokens insecurely without understanding the tradeoff.
- Deploying frontend but not backend.
- Keeping secrets in public React variables.

## Suggested Manual Test Script

```text
1. Create a new account.
2. Create a project.
3. Create an issue with missing title and confirm validation.
4. Create a valid issue.
5. Change its status.
6. Add a comment.
7. Refresh the issue page.
8. Sign out.
9. Try to access the issue page directly.
10. Sign in and confirm the issue still exists.
```

:::quiz
question: Why are frontend protected routes not enough to secure a full-stack app?
options:
  - React cannot render protected routes.
  - Users can still call backend APIs directly, so the backend must enforce authorization.
  - Protected routes disable forms.
  - CSS can override authentication.
answer: 1
explanation: Frontend checks improve user experience, but real access control must happen on the backend or trusted service.
:::

## Extension Ideas

- issue labels
- search and filters
- optimistic status updates
- audit log
- team members
- email notifications
- file attachments
- dashboard charts
- role-based permissions

## Capstone Reflection

After building, write short answers:

- What belongs in React state?
- What belongs on the backend?
- Which endpoint is the riskiest?
- How does the app handle expired authentication?
- What would you test before a production release?

## Recap

A full-stack React project proves that you can connect UI to real data and respect security boundaries. Build one vertical slice first, validate on both sides, handle failure states, and deploy the whole system.
