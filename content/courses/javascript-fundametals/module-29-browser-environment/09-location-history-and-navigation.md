# Location, History, and Navigation

Browser JavaScript can inspect the current URL and, in controlled ways, change navigation state.

The main browser APIs for this are:

- `window.location`
- `URL`
- `URLSearchParams`
- `history`

These APIs are common in routing, search pages, filters, redirects, and single-page applications.

## The `location` Object

`window.location` describes the current page URL.

```js
console.log(window.location.href);
console.log(window.location.protocol);
console.log(window.location.hostname);
console.log(window.location.pathname);
console.log(window.location.search);
console.log(window.location.hash);
```

For this URL:

```text
https://example.com/products?page=2#reviews
```

The parts include:

- `protocol`: `"https:"`
- `hostname`: `"example.com"`
- `pathname`: `"/products"`
- `search`: `"?page=2"`
- `hash`: `"#reviews"`

You can usually use the shorter global name too:

```js
console.log(location.href);
```

But `window.location` makes it clear you are using a browser API.

## Reading Query Parameters

Use `URLSearchParams` to read query parameters.

```js
const params = new URLSearchParams(window.location.search);

console.log(params.get("page"));
```

For:

```text
/products?page=2&sort=price
```

This returns:

```js
"2"
```

Query parameter values are strings.

Convert them when needed.

```js
const page = Number(params.get("page") ?? "1");
```

## Building URLs

Use `URL` and `URLSearchParams` instead of manual string concatenation.

```js
const url = new URL("/products", window.location.origin);

url.searchParams.set("page", "2");
url.searchParams.set("sort", "price");

console.log(url.toString());
```

This safely handles encoding.

```js
const params = new URLSearchParams({
  q: "javascript basics",
  page: "1",
});

console.log(`/search?${params}`);
```

Result:

```text
/search?q=javascript+basics&page=1
```

## Navigating with `location`

Assigning to `location.href` navigates the browser.

```js
window.location.href = "/login";
```

`location.assign()` also navigates.

```js
window.location.assign("/login");
```

`location.replace()` navigates without keeping the current page in history.

```js
window.location.replace("/login");
```

Use `replace()` when the user should not go back to the previous page, such as after a logout or completed redirect flow.

## Reloading

Reload the current page with:

```js
window.location.reload();
```

Use reloads carefully. In many modern apps, updating data and re-rendering part of the page gives a better user experience.

## Hash Navigation

The hash is the part after `#`.

```text
/docs#getting-started
```

It often points to a section on the same page.

```js
console.log(window.location.hash); // "#getting-started"
```

Changing the hash can move the user to an element with the matching ID.

```js
window.location.hash = "faq";
```

Listen for hash changes:

```js
window.addEventListener("hashchange", () => {
  console.log(window.location.hash);
});
```

## The History API

The `history` object lets JavaScript interact with the browser session history.

```js
history.back();
history.forward();
```

Single-page applications often use `pushState()` and `replaceState()`.

```js
history.pushState({ page: "settings" }, "", "/settings");
```

This changes the URL without doing a full page load.

`replaceState()` updates the current history entry.

```js
history.replaceState({ page: "settings" }, "", "/settings?tab=profile");
```

The second argument is historically a title parameter. Pass an empty string.

## The `popstate` Event

When the user moves through history entries, the browser fires `popstate`.

```js
window.addEventListener("popstate", (event) => {
  console.log(event.state);
});
```

Important:

Calling `pushState()` does not automatically fire `popstate`.

`popstate` is mainly for reacting to back and forward navigation.

## Navigation and Security

Be careful when redirecting based on user-controlled URLs.

```js
const params = new URLSearchParams(window.location.search);
const next = params.get("next");

window.location.href = next;
```

This can create an open redirect if `next` points to an attacker-controlled site.

Safer approaches:

- allow only relative paths
- validate against an allowlist
- avoid redirecting to arbitrary URLs

```js
if (next?.startsWith("/")) {
  window.location.href = next;
}
```

## Best Practices

- Use `URL` and `URLSearchParams` for URL parsing and building.
- Convert query values from strings before numeric comparisons.
- Use `location.assign()` or `href` for normal navigation.
- Use `location.replace()` for redirects that should not create a back entry.
- Use the History API carefully in single-page apps.
- Validate user-controlled redirect targets.

## Common Mistakes

Manually concatenating query strings:

```js
const url = "/search?q=" + searchInput.value;
```

This can break when the value contains spaces, ampersands, or other special characters.

Use `URLSearchParams`:

```js
const params = new URLSearchParams({ q: searchInput.value });
const url = `/search?${params}`;
```

Another mistake is assuming query params are numbers.

```js
const page = params.get("page");

console.log(page + 1); // "21" if page is "2"
```

Convert first:

```js
const page = Number(params.get("page") ?? "1");
```

## Summary

The browser exposes URL and navigation state through `location`, `URL`, `URLSearchParams`, and `history`.

Use these APIs to read query strings, build safe URLs, navigate intentionally, and support back/forward behavior in browser applications.
