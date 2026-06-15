# Server-Side Rendering

Server-side rendering means React renders the initial UI on the server and sends HTML to the browser.

The browser can display content quickly, then React hydrates the HTML to make it interactive.

## The SSR Request Flow

```text
browser requests /products/42
        |
        v
server loads route and data
        |
        v
React renders HTML
        |
        v
server sends HTML response
        |
        v
browser displays content
        |
        v
JavaScript loads and hydrates
```

The exact APIs depend on the framework, but the shape is similar.

## What the Server Produces

The server sends HTML that already contains page content.

```html
<main>
  <h1>Noise-Canceling Headphones</h1>
  <p>$199</p>
  <button>Add to cart</button>
</main>
```

Before hydration, the user can read the content. The button may not work yet.

After hydration, React attaches event handlers and manages updates.

## Data Fetching on the Server

SSR often fetches data before rendering.

```jsx
async function ProductPage({ productId }) {
  const product = await getProduct(productId);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </main>
  );
}
```

Server data fetching can keep secrets off the client. For example, database credentials and private API keys should stay on the server.

## Benefits

SSR can improve:

- first meaningful content
- SEO for public content
- social link previews
- slow-device startup experience
- access to server-only data sources

It can also reduce client-side loading waterfalls when the server fetches critical data before sending the page.

## Costs

SSR introduces tradeoffs:

- every uncached request may use server CPU
- slow backend calls delay the HTML response
- personalized pages can be hard to cache
- hydration still requires client JavaScript
- server and browser environments differ

You need to measure both server response time and client hydration time.

## Environment Differences

Server code does not have browser-only globals.

```jsx
function BadTheme() {
  const theme = localStorage.getItem("theme"); // localStorage is not available on the server
  return <p>{theme}</p>;
}
```

Move browser-only reads into an effect or pass the value from a safe source.

```jsx
function ThemeLabel() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    setTheme(localStorage.getItem("theme") || "system");
  }, []);

  return <p>{theme}</p>;
}
```

This avoids a server crash, but it may briefly show the fallback value.

## Security Awareness

SSR can access privileged data, so keep boundaries clear.

Do not serialize secrets into HTML.

```html
<script>
  window.__CONFIG__ = { apiKey: "private-secret" };
</script>
```

Anything sent to the browser is public to the user.

## Streaming Awareness

Modern React servers can stream HTML in chunks.

```text
send shell
  -> stream header and layout
  -> stream fast content
  -> stream slower sections when ready
```

Streaming can improve perceived speed because the browser can start rendering before all data is ready.

Frameworks decide how streaming is exposed, but the principle is important: SSR does not have to be one all-or-nothing response.

## Common Mistakes

- Reading `window`, `document`, or `localStorage` during server render.
- Fetching many resources sequentially and creating slow server waterfalls.
- Sending private data in serialized page state.
- Ignoring hydration cost after improving HTML response time.
- Assuming server-rendered HTML means every control is immediately interactive.

:::quiz
question: Which value is safe to expose in SSR HTML?
options:
  - A public product name already visible on the page
  - A database password
  - A private backend API token
  - A user's raw session secret
answer: 0
explanation: HTML is delivered to the browser, so it must not contain secrets. Public page data is fine.
:::

## Practical Challenge

Design an SSR product page.

List:

- which data must be fetched before rendering
- which data can load later on the client
- what can be cached
- what must never be serialized into HTML

## Recap

SSR sends meaningful HTML from the server, but interactivity still depends on client JavaScript and hydration.

Good SSR design balances first content, server latency, caching, hydration cost, and security boundaries.
