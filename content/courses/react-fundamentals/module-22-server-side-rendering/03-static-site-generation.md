# Static Site Generation

Static site generation renders pages ahead of time, usually during a build.

Instead of rendering HTML for every request, the server or CDN can serve prebuilt files.

## How SSG Works

```text
build starts
  -> load content and data
  -> render React pages to HTML
  -> write HTML, CSS, and JS assets

user requests page
  -> CDN serves prebuilt HTML
```

This makes SSG a strong choice for pages that are public and cacheable.

## Good Fits

SSG works well for:

- documentation
- blogs
- marketing pages
- landing pages
- help center articles
- product pages that change predictably
- course content

The user gets fast HTML without needing a server render on every request.

## Poor Fits

SSG is less suitable when:

- content is personalized per request
- data changes every few seconds
- access depends on private session data
- the number of pages is too large to build cheaply
- the page must reflect real-time inventory or pricing

You can still combine SSG with client-side fetching for dynamic sections.

## SSG With Client Data

A static page can include interactive client widgets.

```jsx
function ArticlePage({ article }) {
  return (
    <main>
      <h1>{article.title}</h1>
      <ArticleBody html={article.html} />
      <CommentsWidget articleId={article.id} />
    </main>
  );
}
```

The article can be static. Comments can load in the browser.

This avoids rebuilding the entire page every time a comment changes.

## Rebuilds and Freshness

Static output can become stale.

Common freshness strategies include:

- rebuilding whenever content changes
- scheduled rebuilds
- incremental regeneration if the framework supports it
- client-side revalidation for dynamic sections
- cache invalidation through a CDN

Freshness is a product decision, not only a technical one.

For a blog, five minutes of staleness may be fine. For checkout pricing, it may not be acceptable.

## Dynamic Routes

Static generation often needs a list of paths.

```text
/docs/intro
/docs/components
/docs/deployment
```

For a product catalog, the build may generate one page per product.

Watch out for very large path counts. Building hundreds of thousands of pages can slow deployments.

## SSG vs SSR

```text
SSG:
  render at build time
  fast cached response
  can become stale

SSR:
  render at request time
  fresher personalized response
  uses server work per request
```

Both can hydrate on the client.

Both can use React.

The difference is when the initial HTML is produced.

## Common Mistakes

- Using SSG for data that must be correct at request time.
- Rebuilding an entire large site for tiny content changes without considering incremental strategies.
- Putting user-specific data into static HTML.
- Assuming static means non-interactive.
- Forgetting that client JavaScript still affects performance.

## Edge Case

A static page behind authentication is possible, but be careful.

If the HTML includes private data, it is not safe to serve from a public CDN. For authenticated static shells, fetch private data after the user is verified.

:::quiz
question: When is SSG usually a better fit than SSR?
options:
  - Public documentation that changes occasionally
  - A user's private bank balance
  - A real-time auction price
  - A personalized admin report requiring session checks
answer: 0
explanation: Public documentation is cacheable and can be rendered ahead of time. Highly personalized or real-time data usually needs request-time handling.
:::

## Practical Challenge

Choose a static generation strategy for a course website.

Decide:

- which pages are built ahead of time
- what triggers rebuilds
- what client-side widgets still need dynamic data
- what freshness delay is acceptable

## Recap

SSG renders pages before users request them. It is excellent for public, cacheable content and can be combined with client-side dynamic sections.

The main tradeoff is freshness versus speed and simplicity.
