# Sessions vs Tokens

## Why It Matters

After a user logs in, the server needs a way to recognize later requests. Sessions and tokens are two common approaches. Both can be secure or insecure depending on storage, expiration, rotation, and invalidation.

The right choice affects scaling, logout behavior, mobile clients, browser security, and incident response.

## Core Concepts

### Server-Side Sessions

A server-side session stores authentication state on the server. The browser receives a session ID, usually in an HTTP-only cookie. On each request, the server looks up that session ID in a store such as Redis or a database.

Benefits:

- Easy server-side logout and revocation.
- Session data can be changed without issuing a new client token.
- Cookie storage can be protected from JavaScript using `HttpOnly`.

Costs:

- Requires shared session storage for horizontal scaling.
- Every authenticated request may need a session lookup.
- Cross-domain API usage needs careful cookie and CORS configuration.

### Tokens

A token carries proof of authentication. Tokens may be opaque random strings stored server-side, or self-contained signed values such as JWTs.

Benefits:

- Works well for APIs and mobile clients.
- Self-contained tokens can reduce server lookups.
- Can be passed through `Authorization: Bearer` headers.

Costs:

- Revocation is harder for self-contained tokens.
- Stolen bearer tokens can be used until expiration.
- Client storage decisions are security-critical.

### Access Tokens and Refresh Tokens

A common modern design uses short-lived access tokens and longer-lived refresh tokens. The access token authenticates API calls. The refresh token obtains new access tokens.

Refresh tokens should be protected more strongly, rotated, and revocable.

## Syntax/Examples

### Cookie Session Sketch

```js
import express from 'express';
import { randomBytes } from 'node:crypto';

const app = express();
const sessions = new Map();

app.use(express.json());

app.post('/login', async (req, res) => {
  // Replace with real password verification.
  const user = { id: 'u1', email: req.body.email };
  const sessionId = randomBytes(32).toString('hex');

  sessions.set(sessionId, {
    userId: user.id,
    createdAt: Date.now()
  });

  res.cookie('sid', sessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  });

  res.json({ user });
});
```

The `Map` is only for demonstration. Production systems need Redis, a database, or another shared store.

### Bearer Token Middleware Sketch

```js
export function requireBearerToken({ tokenService }) {
  return async (req, res, next) => {
    try {
      const header = req.get('authorization') ?? '';
      const [scheme, token] = header.split(' ');

      if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Missing bearer token' });
      }

      req.auth = await tokenService.verify(token);
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

This middleware does not care whether `tokenService` verifies a JWT or an opaque token.

## Use Cases

Sessions are often a strong fit for:

- Traditional browser apps.
- Admin dashboards.
- Apps needing immediate logout.
- Systems with centralized session storage.

Tokens are often a strong fit for:

- Public APIs.
- Mobile apps.
- Service-to-service calls.
- Distributed systems where each service verifies signed tokens.

Hybrid designs are common: a browser app uses secure cookies, while internal APIs receive short-lived bearer tokens from the backend.

## Tradeoffs

Sessions favor control. Tokens favor portability. A self-contained JWT can be verified without a database call, but that same property makes revocation harder. A server session can be revoked immediately, but it creates a dependency on session storage.

Storage matters as much as format. A JWT in unsafe browser storage can be worse than a session cookie. A session cookie without CSRF protection can also be vulnerable.

## Common Mistakes

- Storing sessions in process memory while running multiple instances.
- Using long-lived access tokens with no revocation plan.
- Storing bearer tokens in `localStorage` without considering XSS impact.
- Forgetting CSRF protection for cookie-authenticated state-changing requests.
- Treating refresh tokens like harmless access tokens.

## Practical Challenge

Design login for a browser-based admin panel. Choose either server sessions or token-based auth. Write down how logout works, where credentials are stored, how expiration works, and what happens if one app instance restarts.

## Recap

Sessions store authentication state on the server and identify it with a client cookie. Tokens carry authentication proof, often in headers. Sessions are easier to revoke; tokens are easier to pass across APIs. Secure storage, expiration, rotation, and invalidation determine whether either approach is safe.

