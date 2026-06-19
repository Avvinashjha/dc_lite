# Compression and Payload Optimization

## Why It Matters

APIs spend time not only computing responses but also serializing and transferring them. Large payloads increase latency, bandwidth cost, memory usage, and client parsing time. Compression and payload design reduce that cost.

Optimization should target useful bytes. Sending a compressed 5 MB response is often worse than designing the endpoint to return 50 KB of relevant data.

## Core Concepts

### Compression

Compression reduces response size using algorithms such as gzip, Brotli, or deflate. Clients advertise support through the `Accept-Encoding` header. Servers respond with `Content-Encoding`.

Compression works best for text formats such as JSON, HTML, CSS, and JavaScript. It is less useful for already-compressed images, videos, and archives.

### Payload Shape

Payload optimization means returning the right data:

- Avoid fields the client does not need.
- Avoid deeply nested repeated objects.
- Use pagination for lists.
- Use summary endpoints for list views and detail endpoints for details.
- Prefer stable, documented response shapes.

### Serialization Cost

Large JSON responses consume CPU and memory in Node during `JSON.stringify`. A response can be slow even before it reaches the network.

## Syntax/Examples

### Express Compression

```js
import express from 'express';
import compression from 'compression';

const app = express();

app.use(compression({
  threshold: 1024,
  filter(req, res) {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

app.get('/articles', async (req, res) => {
  res.json(await articleRepository.listSummaries());
});
```

`threshold` avoids spending CPU compressing tiny responses where the gain is minimal.

### Manual Payload Projection

```js
function toArticleSummary(article) {
  return {
    id: article.id,
    title: article.title,
    authorName: article.authorName,
    publishedAt: article.publishedAt
  };
}

app.get('/articles', async (req, res) => {
  const articles = await articleRepository.listPublished();
  res.json({ data: articles.map(toArticleSummary) });
});

app.get('/articles/:id', async (req, res) => {
  const article = await articleRepository.findPublishedById(req.params.id);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});
```

The list endpoint returns summaries. The detail endpoint returns the full record.

### Nginx Compression Sketch

```nginx
gzip on;
gzip_types application/json text/plain text/css application/javascript;
gzip_min_length 1024;

server {
    listen 80;

    location /api/ {
        proxy_pass http://127.0.0.1:3000;
    }
}
```

Compression can happen in Express or Nginx. Avoid double compression.

## Use Cases

Use compression for:

- JSON API responses larger than about 1 KB.
- Public content APIs.
- Server-rendered HTML.
- Text assets when Nginx or CDN does not already handle them.

Use payload optimization for:

- List endpoints.
- Mobile clients on slower networks.
- High-traffic APIs where bandwidth cost matters.
- Responses with large nested relations.

## Tradeoffs

Compression saves bandwidth but costs CPU. Under heavy CPU pressure, compression can worsen latency. Nginx, CDN, or edge compression may be more efficient than doing it inside Node.

Projection improves performance but adds response variants. Keep API contracts clear so clients know which fields are available from each endpoint.

## Common Mistakes

- Compressing already-compressed files.
- Returning huge unpaginated JSON arrays.
- Including internal fields or sensitive fields because database rows are returned directly.
- Creating many undocumented field selection options that are hard to support.
- Ignoring JSON serialization time in performance investigations.

## Practical Challenge

Take a list endpoint that returns full records. Create a summary mapper and add pagination. Measure response size before and after. Then enable gzip and compare compressed size.

## Recap

Compression reduces transfer size, while payload optimization reduces the data that must be queried, serialized, transferred, and parsed. Start by returning the right data, then use compression at the appropriate layer for text responses that are large enough to benefit.

