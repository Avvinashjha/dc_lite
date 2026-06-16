# Authentication and Security

## Why It Matters

Authentication answers the question "who is making this request?" Security answers the broader question "can this request safely do what it is trying to do?" In Node.js applications, these concerns show up in login forms, API tokens, password storage, cookies, database queries, error handling, logging, file uploads, and deployment settings.

A backend can be feature complete and still be unsafe. A login endpoint that stores plain text passwords, a route that trusts a user supplied `role`, or an Express app that accepts unlimited JSON bodies can create serious production incidents. Security is not one library. It is a set of habits applied at every boundary where data enters or leaves the system.

## Core Concepts

### Authentication vs Authorization

Authentication verifies identity. Authorization decides what an authenticated user is allowed to do.

For example:

- Authentication: "This request belongs to user `123`."
- Authorization: "User `123` can edit this invoice because they own it."

Do not confuse the two. A valid session proves identity, but it does not automatically allow access to every resource.

### Password Hashing

Passwords must never be stored as plain text. They should be hashed with a slow, password-specific algorithm such as `bcrypt`, `argon2`, or `scrypt`.

Hashing is one-way. When a user logs in, the server hashes the submitted password with the stored hash parameters and compares the result. A good password hash also includes a salt, which prevents attackers from using precomputed lookup tables against many users at once.

Node has a built-in `scrypt` implementation:

```js
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);

  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  const [salt, key] = storedHash.split(':');
  const derivedKey = await scryptAsync(password, salt, 64);
  const storedKey = Buffer.from(key, 'hex');

  return timingSafeEqual(storedKey, derivedKey);
}
```

In production, many teams use `argon2` or `bcrypt` packages because they expose familiar password hashing defaults and migration paths. The key idea is the same: use a slow password hash, never a fast general hash like SHA-256.

### Sessions, Cookies, and Tokens

After login, the server needs a way to recognize later requests. Common approaches include:

- Server-side sessions stored in Redis or a database, with the browser holding a signed session cookie.
- JSON Web Tokens sent as bearer tokens or stored in carefully configured cookies.
- API keys for server-to-server integrations.

Cookies can be safer for browser apps when configured with `HttpOnly`, `Secure`, and `SameSite` attributes. `HttpOnly` prevents client-side JavaScript from reading the cookie, which reduces damage from cross-site scripting. `Secure` sends the cookie only over HTTPS. `SameSite` helps reduce cross-site request forgery.

### Input Validation

Never trust `req.body`, `req.params`, `req.query`, headers, cookies, uploaded filenames, or environment variables just because they came through a framework. Validate shape, type, length, range, and business rules before using the data.

Validation should happen near the boundary:

```js
function requireString(value, fieldName, maxLength = 255) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${fieldName} is required`);
  }

  if (value.length > maxLength) {
    throw new Error(`${fieldName} is too long`);
  }

  return value.trim();
}

app.post('/profile', async (req, res, next) => {
  try {
    const displayName = requireString(req.body.displayName, 'displayName', 80);

    await users.updateDisplayName(req.user.id, displayName);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
```

Libraries such as Zod, Joi, Valibot, and Yup can make validation more explicit and reusable.

## Syntax and Examples

### A Minimal Express Login Flow

This example shows the shape of a login endpoint. It uses a fake `users` repository so the security flow is easier to see.

```js
import express from 'express';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import { verifyPassword } from './passwords.js';
import { sessions, users } from './data.js';

const app = express();

app.use(express.json({ limit: '32kb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await users.findByEmail(email.toLowerCase());

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const sessionId = randomUUID();
    await sessions.create(sessionId, { userId: user.id });

    res.cookie('sid', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 8
    });

    res.json({ user: { id: user.id, email: user.email } });
  } catch (error) {
    next(error);
  }
});
```

Important details:

- The JSON body has a small size limit.
- The error message does not reveal whether the email exists.
- The password is verified against a stored hash.
- The session cookie is `HttpOnly`.
- The response avoids returning sensitive fields such as password hashes.

### Authentication Middleware

Middleware can load the current user once and attach it to the request for later route handlers.

```js
export function requireUser({ sessions, users }) {
  return async function requireUserMiddleware(req, res, next) {
    try {
      const sessionId = req.signedCookies.sid || req.cookies.sid;

      if (!sessionId) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const session = await sessions.find(sessionId);

      if (!session) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const user = await users.findById(session.userId);

      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      req.user = { id: user.id, email: user.email, role: user.role };
      next();
    } catch (error) {
      next(error);
    }
  };
}
```

### Authorization Middleware

Authorization should be checked close to the resource being accessed.

```js
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

app.delete('/admin/users/:id', requireUser(deps), requireRole('admin'), async (req, res) => {
  await users.deleteById(req.params.id);
  res.status(204).end();
});
```

Use `401 Unauthorized` when the user is not authenticated. Use `403 Forbidden` when the user is authenticated but not allowed to perform the action.

## Security Practices for Express Apps

### Limit Request Bodies

Large request bodies can exhaust memory or CPU. Configure limits for JSON, URL-encoded forms, and file uploads.

```js
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
```

### Use Security Headers

The `helmet` package sets many useful HTTP headers:

```js
import helmet from 'helmet';

app.use(helmet());
```

Security headers are not a replacement for correct application logic, but they reduce common browser attack surfaces.

### Avoid Sensitive Logs

Logs are often copied into external systems. Do not log passwords, reset tokens, raw authorization headers, session IDs, or full payment details.

```js
app.use((req, _res, next) => {
  console.info({
    method: req.method,
    path: req.path,
    userId: req.user?.id
  });

  next();
});
```

### Handle Errors Carefully

In production, avoid sending stack traces to users. Log detailed errors internally and return a stable public error shape.

```js
app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    error: 'Internal server error'
  });
});
```

## Use Cases

Authentication and security patterns are needed for:

- User dashboards that require login.
- Admin routes that require special permissions.
- APIs consumed by mobile apps or frontend SPAs.
- Internal tools that should only be accessible to employees.
- Webhooks that must verify signatures before processing events.
- Multi-tenant apps where users must only access their own organization data.

## Tradeoffs

Server-side sessions are easy to revoke and keep sensitive state on the server, but they require shared storage when you run multiple app instances. JWTs can reduce server lookups for some API calls, but revocation and token storage become more complicated. API keys are simple for machine clients, but they need rotation, scoping, and careful storage.

Security choices also affect user experience. Short session lifetimes reduce risk but may frustrate users. Strict rate limits block brute force attempts but can also block legitimate users behind shared networks. Good systems make these tradeoffs explicit and observable.

## Common Mistakes

- Storing passwords with SHA-256, MD5, or plain text.
- Returning different login errors for unknown emails and wrong passwords.
- Trusting client-provided roles, user IDs, or ownership fields.
- Forgetting `HttpOnly`, `Secure`, or `SameSite` on cookies.
- Using unlimited request body sizes.
- Logging tokens, passwords, or session identifiers.
- Treating authentication as authorization.
- Revealing internal stack traces in production responses.
- Skipping rate limits on login, password reset, and signup routes.

## Practical Challenge

Build a small Express app with:

1. `POST /register` that validates email and password, hashes the password, and stores the user.
2. `POST /login` that verifies the password and sets an `HttpOnly` session cookie.
3. `GET /me` that returns the current user only when authenticated.
4. `POST /logout` that deletes the session and clears the cookie.

Then add:

- A request body size limit.
- Generic login failure messages.
- A simple rate limit on `/login`.
- Tests for missing credentials, wrong passwords, and successful login.

## Recap

Authentication identifies the requester. Authorization decides what the requester can do. A secure Node.js app hashes passwords with a slow password algorithm, validates all external input, protects cookies and tokens, limits request sizes, avoids sensitive logs, and treats every route as a boundary that needs clear trust rules.
