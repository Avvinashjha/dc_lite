# CSR vs SSR

React can render UI in different places.

Client-side rendering runs most rendering work in the browser. Server-side rendering prepares HTML on the server before the browser receives it.

Both models are useful. The right choice depends on loading speed, interactivity, data needs, caching, and operational complexity.

## Client-Side Rendering

In client-side rendering, the browser receives a small HTML shell and JavaScript bundle.

```html
<div id="root"></div>
<script src="/assets/app.js"></script>
```

The browser downloads JavaScript, runs React, fetches data, and then builds the UI.

```text
request page
  -> receive shell HTML
  -> download JS
  -> parse and execute JS
  -> fetch data
  -> render UI
```

CSR is common for dashboards, internal apps, and highly interactive pages where SEO and initial content are less important.

## Server-Side Rendering

In server-side rendering, the server runs React and sends HTML for the initial view.

```text
request page
  -> server fetches data
  -> server renders HTML
  -> browser shows content
  -> browser downloads JS
  -> React hydrates
```

Users can see content before all JavaScript finishes loading.

## Comparing Tradeoffs

CSR strengths:

- simple deployment for static hosting
- rich app-like interactions
- less server rendering infrastructure
- good for authenticated apps where content is user-specific

CSR costs:

- slower first meaningful content on weak devices or networks
- empty or thin HTML for crawlers if not handled separately
- more work shifted to the browser
- loading states often appear before real content

SSR strengths:

- meaningful HTML arrives earlier
- better first-load experience for content pages
- easier indexing and link previews
- can fetch secure server-side data before rendering

SSR costs:

- more server complexity
- hydration can still require large JavaScript
- caching is harder when content is personalized
- server latency affects page response time

## Hydration Is the Bridge

SSR does not remove client JavaScript for interactive React components.

The browser still needs to hydrate the server HTML so event handlers and state can work.

```text
server HTML: visible but not wired
client JS: downloads and runs
hydration: React attaches behavior to existing DOM
interactive page: user events work
```

If the page is mostly static, you may need very little client JavaScript. If the page is heavily interactive, SSR improves the first view but does not eliminate client work.

## Static Generation

Static site generation builds HTML ahead of time instead of per request.

```text
build time:
  fetch content
  render HTML
  save files

request time:
  serve cached HTML
```

This is ideal for docs, marketing pages, blogs, and product pages that can be cached.

## Choosing a Rendering Strategy

Ask these questions:

- Does the page need to be indexed by search engines?
- Does the user need useful content before JavaScript loads?
- Is the content public, personalized, or frequently changing?
- Can the response be cached?
- How much interactivity is needed above the fold?
- Can the backend support server rendering traffic?

Many production apps mix strategies.

```text
Marketing page: SSG
Product detail: SSG or SSR
Account settings: CSR behind auth
News feed: SSR shell plus client updates
Admin dashboard: CSR
```

## Common Mistakes

- Assuming SSR automatically makes an app fast.
- Sending huge JavaScript bundles after server-rendered HTML.
- Using SSR for every authenticated dashboard screen without a clear benefit.
- Forgetting that hydration can delay interactivity.
- Treating CSR and SSR as mutually exclusive across an entire product.

## Awareness Note

Rendering strategy is not only a React decision. It also depends on CDN caching, API latency, database access, authentication, deployment platform, and business requirements.

:::quiz
question: What is the main benefit of SSR compared with pure CSR?
options:
  - The browser can receive meaningful HTML before running the full React app
  - React no longer needs JavaScript in the browser for interactive components
  - Components stop using state
  - The server skips data fetching
answer: 0
explanation: SSR sends rendered HTML for the initial view. Interactive components still need client JavaScript and hydration.
:::

## Practical Challenge

Pick three pages from a real app:

1. public landing page
2. product or article page
3. authenticated dashboard

For each page, choose CSR, SSR, SSG, or a mix. Write down the user experience and operational reason for the choice.

## Recap

CSR renders mainly in the browser. SSR renders initial HTML on the server. SSG renders ahead of time.

The best React apps often combine strategies instead of forcing every route into the same model.
