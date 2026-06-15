# Common Vulnerabilities

React protects you from some common frontend mistakes, but it does not make an application secure by default.

Security depends on the full system: browser behavior, React rendering, API design, authentication, dependency choices, deployment settings, and developer habits.

## Common Frontend Risks

React developers should recognize these categories:

- Cross-site scripting (XSS): attacker-controlled content runs as JavaScript.
- Cross-site request forgery (CSRF): another site causes an authenticated browser request.
- Broken authentication handling: tokens, sessions, redirects, and logout are mishandled.
- Sensitive data exposure: secrets or private data are shipped to the browser.
- Dependency risk: packages introduce vulnerable or malicious code.
- Insecure transport or headers: HTTPS, CSP, cookie flags, and framing protections are missing.
- Authorization mistakes: the frontend hides actions but the backend still allows them.

The frontend is one layer. Never rely on React UI checks as the only security control.

## Trust Boundaries

A trust boundary is a place where data moves from one level of trust to another.

Examples in a React app:

- URL parameters entering route components
- API responses entering UI rendering
- form input sent to a server
- Markdown or HTML content rendered from a CMS
- environment variables embedded into a bundle
- data stored in `localStorage`, cookies, or IndexedDB

At each boundary, ask:

- Where did this data come from?
- Who can control it?
- Is it being rendered, stored, logged, or sent somewhere else?
- Which layer validates it?

## Frontend Checks Are Not Authorization

This is not enough:

```jsx
function AdminButton({ user }) {
  if (!user.isAdmin) return null;

  return <button onClick={deleteUser}>Delete user</button>;
}
```

Hiding the button improves UX, but the server must still reject unauthorized requests.

```js
app.delete("/api/users/:id", requireAdmin, async (req, res) => {
  // delete user only after server-side authorization
});
```

Users can modify frontend code, call APIs directly, replay requests, or change local storage values.

## Sensitive Data in the Browser

Anything sent to the browser should be treated as visible to the user.

Do not ship:

- database credentials
- private API keys
- admin tokens
- signing secrets
- service account credentials
- unreleased confidential business data

Frontend environment variables are configuration, not secrets. Bundlers inline them into JavaScript that users can inspect.

## Security Headers Awareness

Many important controls are configured by the server or hosting platform, but frontend developers should understand them.

Common headers:

- `Content-Security-Policy`: limits which scripts, styles, images, and connections are allowed.
- `Strict-Transport-Security`: tells browsers to use HTTPS.
- `X-Frame-Options` or CSP `frame-ancestors`: reduces clickjacking risk.
- `Referrer-Policy`: controls how much URL information is sent as a referrer.
- `Permissions-Policy`: limits browser features such as camera or geolocation.

React code should be compatible with strong headers. For example, inline scripts and unsafe style injection can make a strict CSP harder to use.

## Common Mistakes

- Believing React automatically prevents all XSS.
- Treating hidden UI as security.
- Storing long-lived tokens in easily stolen browser storage.
- Putting secrets in `VITE_`, `REACT_APP_`, or other client-exposed variables.
- Logging sensitive user data to analytics or error tools.
- Ignoring dependency warnings because the app "still builds."
- Assuming CORS is an authentication or authorization system.

:::quiz
question: Why is hiding an admin button in React not enough to protect an admin API?
options:
  - Users can call the API directly, so authorization must be enforced on the server
  - React buttons are always public database credentials
  - Hidden buttons automatically bypass HTTPS
  - CSS controls server permissions
answer: 0
explanation: Frontend UI can improve experience, but users can inspect and bypass it. The server must authorize every sensitive action.
:::

## Practice Challenge

Review a React page that calls an API. List all trust boundaries: route params, query params, form input, API responses, browser storage, and rendered content. For each one, write what the frontend does and what the server must still enforce.

## Recap

Security in React starts with knowing what the browser can expose and what the frontend cannot enforce. Treat client code as visible, validate at trust boundaries, and keep real authorization on the server.
