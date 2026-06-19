# OAuth2 and OpenID Connect

## Why It Matters

Many Node.js applications let users sign in with Google, GitHub, Microsoft, Okta, or another identity provider. OAuth2 and OpenID Connect are the standards behind most of these flows.

OAuth2 is about delegated authorization: allowing an application to access resources on behalf of a user. OpenID Connect, or OIDC, adds authentication on top of OAuth2 so an app can learn who the user is.

## Core Concepts

### OAuth2 Roles

OAuth2 involves several roles:

- Resource owner: usually the user.
- Client: your application.
- Authorization server: issues tokens.
- Resource server: API that accepts tokens.

For example, your Node app may be the client, Google may be the authorization server, and Google Calendar may be the resource server.

### Authorization Code Flow

The authorization code flow is the standard server-side web flow:

1. The app redirects the user to the provider.
2. The user authenticates and grants consent.
3. The provider redirects back with a short-lived code.
4. The server exchanges the code for tokens.
5. The app creates its own session for the user.

For browser and mobile public clients, Authorization Code with PKCE protects the code exchange.

### OIDC ID Token

OIDC adds an ID token, usually a JWT, that contains identity claims such as `sub`, `email`, and `email_verified`. The app verifies this token to authenticate the user.

Access tokens are for APIs. ID tokens are for the client application. Do not confuse them.

## Syntax/Examples

### Starting an Authorization Code Flow

```js
import express from 'express';
import { randomBytes } from 'node:crypto';

const app = express();
const stateStore = new Map();

app.get('/auth/start', (req, res) => {
  const state = randomBytes(16).toString('hex');
  stateStore.set(state, { createdAt: Date.now() });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.OIDC_CLIENT_ID,
    redirect_uri: 'https://app.example.com/auth/callback',
    scope: 'openid email profile',
    state
  });

  res.redirect(`https://issuer.example.com/oauth2/authorize?${params}`);
});
```

`state` helps protect against cross-site request forgery and response mix-up attacks.

### Handling the Callback

```js
app.get('/auth/callback', async (req, res, next) => {
  try {
    const { code, state } = req.query;

    if (!stateStore.has(state)) {
      return res.status(400).send('Invalid state');
    }
    stateStore.delete(state);

    const tokenResponse = await fetch('https://issuer.example.com/oauth2/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://app.example.com/auth/callback',
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokens = await tokenResponse.json();
    // Verify tokens.id_token with the provider public keys before trusting claims.
    res.json({ received: Object.keys(tokens) });
  } catch (error) {
    next(error);
  }
});
```

This is a sketch. Production OIDC should use a well-maintained library that handles discovery, JWKS key rotation, nonce, issuer, audience, and clock skew.

## Use Cases

Use OAuth2 when:

- Your app needs access to a user's resources in another service.
- A third-party app needs limited access to your API.
- Machine-to-machine clients need scoped API access.

Use OIDC when:

- Your app wants users to sign in through an identity provider.
- Enterprise customers require central identity management.
- You need identity claims from a trusted issuer.

## Tradeoffs

OAuth2 and OIDC reduce password handling in your app, but they introduce protocol complexity. Correct validation is more important than hand-written cleverness.

Using a provider can improve security and user experience, but it also creates dependency on provider availability, configuration, redirect URI correctness, and account linking rules.

## Common Mistakes

- Treating an OAuth2 access token as proof of login without OIDC validation.
- Skipping `state` validation.
- Failing to verify ID token issuer, audience, signature, and expiration.
- Storing provider refresh tokens unencrypted.
- Using implicit flow for modern browser apps instead of authorization code with PKCE.

## Practical Challenge

Draw the authorization code flow for a Node web app. Label where the browser redirects, where the server exchanges the code, where token verification happens, and where your own application session is created.

## Recap

OAuth2 is about delegated access. OIDC adds authentication and identity. For Node backends, the authorization code flow is the core pattern: redirect, callback, token exchange, ID token verification, then local session creation. Use proven libraries and validate every token boundary.

