Rendering strategies define **how a web page’s content is generated and delivered to users**. Choosing the right strategy affects:

- Performance
- SEO
- Infrastructure cost
- Scalability
- User experience

In this article, we’ll explore the most important rendering strategies used in modern web development, in a framework-agnostic way and understand when to use each one.

## What is Rendering?

Rendering is the process of:

1. Getting data
2. Generating HTML
3. Delivering it to the browser
4. Displaying it to the user

At a high level, rendering can happen in three places:

- On the client (browser)
- On the server
- At the edge (CDN)

Different strategies decide **where and when** HTML is generated.

### Rendering Exists on a Spectrum

Instead of thinking of rendering strategies as separate boxes, think of them as a spectrum:

```
Fully Static  ————————————  Fully Dynamic
    SSG         ISR       SSR         CSR
```

And another important dimension:

```
More Server Work ——————————  More Client Work
    SSR / SSG                     CSR
```

Each approach is a trade-off between:

- Performance
- Flexibility
- Freshness of data
- Infrastructure complexity

Now let’s explore each one.

### Client-Side Rendering (CSR)

In Client-Side Rendering, the browser does most of the work. The server sends a minimal HTML file and JavaScript bundle. The JavaScript then fetches data and builds the UI in the browser.

#### How It Works

```
Request -> Server sends HTML + JS -> Browser runs JS -> Fetches data -> UI renders
```

#### Characteristics

- HTML is mostly empty at first
- JavaScript builds the page
- Rendering happens in the browser

#### Advantages

- Great for highly interactive applications
- Smooth SPA (Single Page Application) experience
- Lower server load
- Easy real-time updates

#### Disadvantages

- Slower first load (must download and execute JS)
- SEO is possible but less optimal (search engines must run JS)
- Poor performance on slow devices

#### When to Use CSR

- Dashboards
- Admin panels
- Internal tools
- Apps with real-time data
- Projects where SEO is not critical

### Server-Side Rendering (SSR)

In Server-Side Rendering, the server generates the full HTML for every request. The browser receives ready-to-display HTML.

#### How It Works

```
Request -> Server fetches data -> Server generates HTML -> Browser displays HTML
```

#### Characteristics

- HTML is generated per request
- Content is immediately visible
- JavaScript enhances interactivity later

#### Advantages

- Fast initial display
- Good SEO (content is present in HTML)
- Works even if JavaScript fails

#### Disadvantages

- Higher server load
- Can increase Time To First Byte (TTFB)
- Every navigation may require a server request

#### When to Use SSR

- E-commerce websites
- News websites
- Marketing pages
- SEO-critical applications

### Static Site Generation (SSG)

In Static Site Generation, HTML is created at build time, not per request. Pages are generated once and served as static files.

#### How It Works

```
Build time -> Generate HTML files -> Deploy to CDN -> Users receive static HTML
```

#### Characteristics

- No server rendering at runtime
- HTML is pre-built
- Extremely fast delivery

#### Advantages

- Very fast (served from CDN)
- Excellent SEO
- Very low hosting cost
- Highly scalable

#### Disadvantages

- Content updates require rebuild
- Not suitable for real-time data
- Hard to personalize per user

#### When to Use SSG

- Blogs
- Documentation
- Portfolio websites
- Landing pages
- Content that changes infrequently

### Incremental Static Regeneration (ISR)

ISR is a hybrid between SSG and SSR.

Pages are generated statically but can be regenerated in the background after a certain time.

#### How It Works

```
Build -> Generate static HTML -> Serve to users
After X time -> Regenerate page in background
```

#### Characteristics

- Static speed
- Periodic updates
- No full rebuild required

#### Advantages

- Combines performance of SSG with freshness of SSR
- Good SEO
- Scales well

#### Disadvantages

- Content may be slightly outdated (until revalidation)
- Not suitable for real-time data

#### When to Use ISR

- Product pages
- Blogs with frequent updates
- E-commerce listings
- Marketing sites with changing content

### Hybrid Rendering

Hybrid rendering means **using different strategies for different pages** in the same application.

Example:

- Homepage -> Static
- Product page -> ISR
- User dashboard -> CSR
- Checkout -> SSR

#### Why Hybrid?

Because no single strategy fits all pages.

#### Advantages

- Optimized per page
- Flexible
- Efficient

#### Disadvantages

- More complex architecture
- Harder to maintain

Modern web apps commonly use hybrid approaches.

### Streaming / Progressive Rendering

Streaming allows the server to send HTML in chunks instead of waiting for the whole page to be ready.

Instead of:

```
Wait -> Send full HTML
```

It becomes:

```
Send header -> Send first section -> Send next section -> Continue...
```

#### Why It Matters

- Improves perceived performance
- Faster First Contentful Paint (FCP)
- Better user experience on slow networks

#### Use Cases

- Large pages
- Content-heavy applications
- Pages that fetch multiple data sources

### Edge Rendering

Edge rendering moves server logic closer to users by running it on edge servers (CDN locations worldwide).

Instead of rendering in one central server:

```
User -> Nearest Edge Location -> Render -> Response
```

#### Advantages

- Lower latency
- Faster global performance
- Good for geo-based personalization

#### Disadvantages

- Limited runtime environment
- More complex deployment model

#### When to Use

- Global applications
- Personalized experiences by location
- Performance-critical apps

### Hydration

When using SSR or SSG, the browser first receives static HTML. But static HTML alone is not interactive.

Hydration is the process where:

- JavaScript loads
- Event listeners attach
- The page becomes interactive

Flow:

```
Server renders HTML → Browser displays → JS loads → Hydration → Interactive UI
```

Without hydration, the page would remain static.

### Comparing Rendering Strategies

| Strategy  | Content Generated | SEO       | Real-Time Data | Server Load |
| --------- | ----------------- | --------- | -------------- | ----------- |
| CSR       | In browser        | Moderate  | Excellent      | Low         |
| SSR       | On each request   | Excellent | Good           | High        |
| SSG       | Build time        | Excellent | Poor           | Very Low    |
| ISR       | Build + periodic  | Excellent | Limited        | Low         |
| Hybrid    | Mixed             | Excellent | Depends        | Balanced    |
| Streaming | During response   | Excellent | Good           | Medium      |
| Edge      | Near user (CDN)   | Excellent | Good           | Distributed |

### How to Choose the Right Strategy

Ask yourself:

1. Does this page need SEO?
2. How often does content change?
3. Does it require real-time updates?
4. Does it need personalization?
5. What is my infrastructure budget?

There is no "best" rendering strategy, only the one that fits your use case.

### Final Thoughts

Modern web development is no longer about choosing one rendering method for the entire app.

Instead, it's about understanding:

- Where rendering happens
- When HTML is generated
- How data freshness is handled
- How performance is affected

Most real-world applications today use a **hybrid approach**, combining static generation, server rendering, and client-side interactivity.

The key is understanding the trade-offs and choosing intentionally.
