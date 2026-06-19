# EJS Templates and Serving HTML Pages

## Why It Matters

Not every Express app is a JSON API. Server-rendered HTML is useful for admin tools, dashboards, transactional pages, and progressive enhancement. EJS keeps templates close to HTML while allowing dynamic values.

## Core Concepts

- `app.set("view engine", "ejs")` configures Express rendering.
- `res.render(view, data)` renders a template and sends HTML.
- Templates should escape untrusted values by default with `<%=`.
- Static assets are served with `express.static()`.
- Server-rendered pages still need validation, CSRF protection for forms, and careful error handling.

## Flow to Remember

The browser requests a page, a route loads data, Express renders an EJS template with that data, and the browser receives HTML plus links to static CSS or client JavaScript.

## Syntax and Examples

```js
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'public')));

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    title: 'Operations Dashboard',
    jobs: [{ id: 'job_1', status: 'running' }]
  });
});

app.listen(3000);
```

## Use Cases and Tradeoffs

- Use EJS for small server-rendered interfaces where a full frontend app would be unnecessary.
- Render initial HTML on the server and enhance with client-side JavaScript only where needed.
- Use layouts or partials for repeated navigation, forms, and status components.
- Prefer JSON APIs plus a frontend framework when the UI has complex client-side state.

## Common Mistakes

- Rendering unescaped user input with `<%-` and creating XSS risk.
- Putting database calls directly inside templates.
- Serving private files from a public static directory.
- Forgetting cache headers for static assets.

## Practical Challenge

Create an EJS page that lists support tickets and includes a form to create a ticket. Validate the form server-side before rendering success or error messages.

## Recap

- Express can serve HTML and APIs in the same app.
- EJS templates should receive prepared data, not perform business logic.
- Escaping and form security matter as much for HTML as for JSON APIs.

