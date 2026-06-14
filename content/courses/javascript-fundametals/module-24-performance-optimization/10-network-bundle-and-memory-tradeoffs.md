# Network, Bundle, and Memory Tradeoffs

JavaScript performance is affected by more than the code that runs after loading.

Network requests, bundle size, and memory usage can all shape the user experience.

## Network Performance Basics

Every request has costs.

The browser may need to:

- resolve a domain
- connect to a server
- negotiate security
- send the request
- wait for the response
- download the response body

Modern protocols are efficient, but unnecessary requests still add overhead.

## Reduce Unnecessary Requests

Avoid fetching the same data repeatedly when it has not changed.

```js
let cachedSettings;

async function getSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }

  const response = await fetch("/api/settings");
  cachedSettings = await response.json();

  return cachedSettings;
}
```

This simple cache may be enough for data that rarely changes.

For changing data, use expiration or invalidation.

## Request Only What You Need

Large responses take longer to download and parse.

If an API supports query options, request only needed data.

```js
const params = new URLSearchParams({
  limit: "20",
  fields: "id,name,avatarUrl",
});

const response = await fetch(`/api/users?${params}`);
```

Smaller responses can improve both network and JavaScript parsing time.

## Bundle Size

A JavaScript bundle is the code sent to the browser.

Large bundles can slow down:

- download
- parsing
- compilation
- startup execution

Ways to reduce bundle cost include:

- removing unused dependencies
- using smaller libraries
- code splitting
- lazy loading rare features
- avoiding duplicate packages
- shipping production builds

## Tree Shaking

Tree shaking is a build tool optimization that removes unused exports.

```js
import { formatDate } from "./formatters.js";
```

If the build tool can prove that other exports are unused, it may remove them from the final bundle.

Tree shaking works best with ES modules and side-effect-free code.

## Avoid Heavy Dependencies for Small Jobs

Before adding a package, ask what it costs.

```js
const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

console.log(formatter.format(new Date()));
```

Built-in browser APIs can sometimes replace a dependency.

Do not avoid packages blindly.

Use them when they provide real value.

## Memory and Speed Tradeoffs

Some optimizations use more memory to save time.

Examples:

- caching API responses
- memoizing function results
- preloading data
- building lookup maps
- keeping hidden UI already rendered

These can be good choices.

They can also increase memory usage and make leaks more damaging.

## Building Lookup Maps

If you repeatedly search an array by id, a `Map` can help.

```js
const productsById = new Map();

for (const product of products) {
  productsById.set(product.id, product);
}

function getProduct(id) {
  return productsById.get(id);
}
```

This uses extra memory, but it avoids repeated full-array scans.

Use this when lookups are frequent enough to justify the setup cost.

## Avoid Premature Preloading

Preloading can make later interactions faster.

But loading too much early can hurt startup.

```js
link.rel = "prefetch";
link.href = "/reports.js";
document.head.append(link);
```

Prefetch rare features only when the browser and network are likely to have spare capacity.

## Common Mistakes

- Adding a large dependency for a small utility.
- Loading all routes or screens during startup.
- Caching data forever without memory or freshness rules.
- Downloading large API responses and using only a few fields.
- Improving CPU time while making startup network cost worse.

## Summary

Performance involves tradeoffs between network, CPU, memory, and user experience.

Reduce unnecessary downloads, keep bundles focused, request only useful data, and use memory-based optimizations only when the speed benefit is worth it.
