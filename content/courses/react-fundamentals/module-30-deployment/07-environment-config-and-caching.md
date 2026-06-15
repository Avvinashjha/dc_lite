# Environment Config and Caching

Deployment is not complete until configuration and caching are intentional.

React apps often fail in production because the build points to the wrong API, a secret was exposed, a browser cached stale files, or a service worker kept serving an old version. This lesson focuses on those edge cases.

## Build-Time vs Runtime Config

Most static React apps use build-time config.

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

That value is replaced when the app is built.

Runtime config is different. The app loads configuration after it starts.

Example:

```js
async function loadConfig() {
  const response = await fetch("/config.json", { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load app config");
  }

  return response.json();
}
```

Use runtime config when the same build artifact must move across environments, such as staging and production.

## Public Values vs Secrets

Frontend code is public. Users can inspect JavaScript bundles, network requests, source maps, and local storage.

Safe public values:

- public API base URL
- public analytics ID
- feature flag key designed for browsers
- support email address

Unsafe public values:

- database password
- private API token
- signing secret
- payment provider secret key
- service account credentials

If a value must be secret, use a backend, serverless function, or server-rendered route to access it.

## Cache Headers

Caching improves performance, but the wrong cache rule can break deployments.

Good default pattern:

- cache fingerprinted assets for a long time
- do not aggressively cache `index.html`
- do not aggressively cache runtime `config.json`

Example:

```text
/assets/app.8d31f.js
Cache-Control: public, max-age=31536000, immutable

/index.html
Cache-Control: no-cache

/config.json
Cache-Control: no-store
```

Why:

`index.html` points to the current asset filenames. If a browser keeps an old `index.html`, it may keep loading an old app.

## Cache Busting

Build tools often add hashes to asset filenames.

Example:

```text
main.6f5a21c8.js
styles.2af901bf.css
```

When the file content changes, the filename changes. That makes long-term caching safe because old and new files can coexist.

Do not manually rename files to bust cache. Let the build tool handle it.

## Service Worker Edge Cases

Progressive web apps may use service workers to cache files.

This adds power and risk:

- users may keep running an older app version
- offline cache may hide deployment bugs
- API responses can become stale
- a broken service worker can be hard to replace

If you add a service worker, include an update strategy and test it after every deployment.

## Feature Flags

Feature flags let you control behavior without redeploying.

Use flags for:

- gradual rollout
- hiding unfinished features
- emergency disable switches
- experiments

Do not use flags to avoid deleting dead code forever. Remove old flags after the rollout is complete.

## Configuration Checklist

Before production:

- required variables are documented
- build fails when required public config is missing
- secrets are not in browser variables
- preview and production configs are separate
- API CORS allows the deployed domain
- OAuth callback URLs match deployed URLs
- cache headers match the asset type
- service worker behavior is tested, if present

## Common Mistakes

- Treating `.env` as secret just because it is ignored by Git.
- Changing hosting environment variables without rebuilding.
- Caching `index.html` for a year.
- Caching `config.json` when it is supposed to change at runtime.
- Exposing private tokens through `VITE_`, `REACT_APP_`, or `NEXT_PUBLIC_`.
- Forgetting that preview URLs may need different CORS and OAuth settings.

:::quiz
question: Which file should usually avoid long immutable caching in a static React app?
options:
  - A fingerprinted JavaScript asset
  - A fingerprinted CSS asset
  - index.html
  - A hashed font file
answer: 2
explanation: index.html usually points to the current asset filenames, so it should be revalidated instead of cached immutably for a long time.
:::

## Practice Challenge

Design a deployment configuration strategy.

Requirements:

- list all public config values
- identify which values must be server-side secrets
- decide whether the app uses build-time or runtime config
- define cache headers for `index.html`, assets, and config files
- explain how preview deployments differ from production
- write one test for missing required config

## Recap

Production React apps need clear configuration boundaries and cache rules. Public config can live in the frontend bundle, secrets cannot, fingerprinted assets can be cached aggressively, and entry files such as `index.html` should stay easy to refresh.
