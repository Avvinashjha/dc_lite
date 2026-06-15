# Fetch vs Axios

`fetch` and Axios both make HTTP requests from JavaScript.

`fetch` is built into modern browsers.

Axios is a popular third-party library with a friendlier API for some use cases.

## Using Fetch

```js
async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
```

Important detail: `fetch` does not reject the promise for HTTP 404 or 500 responses.

It only rejects for network-level failures.

You must check `response.ok`.

## Sending JSON With Fetch

```js
async function createPost(post) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error("Could not create post");
  }

  return response.json();
}
```

`fetch` is explicit, which is good for learning and small projects.

## Using Axios

```js
import axios from "axios";

async function getUser(userId) {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
}
```

Axios rejects for many non-2xx HTTP statuses by default.

It also automatically serializes JSON request bodies in common cases.

```js
async function createPost(post) {
  const response = await axios.post("/api/posts", post);
  return response.data;
}
```

## Axios Instances

Large apps often create a configured client.

```js
const api = axios.create({
  baseURL: "/api",
  headers: {
    Accept: "application/json",
  },
});

export async function getProjects() {
  const response = await api.get("/projects");
  return response.data;
}
```

Instances help centralize base URLs, headers, interceptors, and authentication behavior.

## Interceptors Awareness

Axios interceptors can run before requests or after responses.

They are often used for auth tokens or logging.

```js
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

Be careful with interceptors.

Hidden global behavior can make requests hard to reason about.

## Choosing Between Them

Use `fetch` when:

- you want no extra dependency
- the request logic is simple
- you are comfortable checking `response.ok`
- you are using platform APIs such as `AbortController`

Use Axios when:

- your team already uses it
- you want instances and interceptors
- you prefer its error behavior and response shape
- you need older browser support through project tooling

## Common Mistakes

- Forgetting that `fetch` resolves on HTTP 500.
- Mixing `fetch` and Axios patterns in the same API helper.
- Catching every error but showing no useful user message.
- Storing auth token logic in many separate components.
- Assuming Axios or `fetch` automatically solves caching.

:::quiz
question: What happens when `fetch` receives an HTTP 404 response?
options:
  - It usually resolves, and you need to check `response.ok`
  - It always throws before you can read the response
  - It retries the request automatically
  - It converts the response to JSON automatically
answer: 0
explanation: `fetch` rejects for network failures, but HTTP error statuses still produce a response object.
:::

## Practical Challenge

Write two helpers for `/api/tasks`:

- `listTasks()` with `fetch`
- `createTask(task)` with Axios

For each helper, include error handling and return only the parsed response data.

Then decide which style you would standardize on in one project.

## Recap

`fetch` is built in and explicit.

Axios adds convenient defaults, instances, and interceptors.

Neither one replaces good loading states, error handling, cancellation, or caching strategy.
