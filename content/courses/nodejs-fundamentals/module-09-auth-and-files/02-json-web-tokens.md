# JSON Web Tokens (JWT)

## Why It Matters

JSON Web Tokens, usually called JWTs, are a common way to send signed claims between systems. In Node.js APIs, they are often used for stateless authentication, service-to-service calls, email verification links, password reset flows, and short-lived access tokens.

JWTs are useful, but they are also easy to misuse. A token that lasts too long, stores sensitive data, skips signature verification, or is saved in unsafe browser storage can become a production security problem. The goal is not to use JWTs everywhere. The goal is to understand what they guarantee, what they do not guarantee, and how to design around their tradeoffs.

## Core Concepts

### JWT Structure

A JWT has three Base64URL-encoded parts separated by dots:

```text
header.payload.signature
```

The header describes the token type and signing algorithm. The payload contains claims. The signature proves that the token was signed by someone who knows the secret or private key.

Example payload:

```json
{
  "sub": "user_123",
  "email": "ada@example.com",
  "role": "admin",
  "iat": 1735689600,
  "exp": 1735693200
}
```

Common registered claims:

- `sub`: subject, usually the user ID.
- `iss`: issuer, the system that created the token.
- `aud`: audience, the system that should accept the token.
- `iat`: issued at timestamp.
- `exp`: expiration timestamp.
- `nbf`: not before timestamp.
- `jti`: unique token ID.

### Signed Does Not Mean Encrypted

Most JWTs are signed, not encrypted. Anyone who has the token can decode the header and payload. Do not put passwords, password hashes, reset secrets, API keys, private profile data, or payment details in a normal JWT.

The signature only proves integrity. It tells you the payload has not been changed since signing. It does not hide the payload.

### Access Tokens and Refresh Tokens

A common production design uses two token types:

- Short-lived access token: sent with API requests and valid for minutes.
- Longer-lived refresh token: used to obtain a new access token and stored more carefully.

Refresh tokens should usually be revocable and rotated. If a refresh token is stolen, the attacker can keep creating access tokens until the refresh token is rejected or expires.

### Algorithms and Keys

Symmetric algorithms such as `HS256` use the same secret to sign and verify. Asymmetric algorithms such as `RS256` or `ES256` use a private key to sign and a public key to verify.

Use `HS256` only when the same trusted service signs and verifies tokens. Use asymmetric keys when many services need to verify tokens but only one authority should sign them.

## Syntax and Examples

### Installing a JWT Library

The popular `jsonwebtoken` package is widely used:

```bash
npm install jsonwebtoken
```

The `jose` package is another modern option with strong support for standards-based JWT and JWK workflows:

```bash
npm install jose
```

The examples below use `jsonwebtoken` because the API is compact for learning.

### Signing an Access Token

```js
import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

if (!accessTokenSecret) {
  throw new Error('ACCESS_TOKEN_SECRET is required');
}

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    accessTokenSecret,
    {
      algorithm: 'HS256',
      issuer: 'nodejs-fundamentals-api',
      audience: 'nodejs-fundamentals-web',
      expiresIn: '15m'
    }
  );
}
```

Good token payloads are small. Prefer stable identifiers such as `sub` over copying whole user records into the token.

### Verifying Bearer Tokens in Express

```js
import jwt from 'jsonwebtoken';

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export function requireJwt(req, res, next) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Bearer token required' });
  }

  const token = authorization.slice('Bearer '.length);

  try {
    const claims = jwt.verify(token, accessTokenSecret, {
      algorithms: ['HS256'],
      issuer: 'nodejs-fundamentals-api',
      audience: 'nodejs-fundamentals-web'
    });

    req.user = {
      id: claims.sub,
      role: claims.role
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

Verification should check the signature, algorithm, expiration, issuer, and audience where applicable. Do not decode a token and trust the result without verification.

### Login Endpoint Returning a Token

```js
app.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await users.findByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = createAccessToken(user);

    res.json({
      accessToken,
      tokenType: 'Bearer',
      expiresIn: 900
    });
  } catch (error) {
    next(error);
  }
});
```

This pattern works for APIs, mobile clients, and some browser clients. For browser apps, consider whether an `HttpOnly` cookie session is safer for your threat model than storing bearer tokens in JavaScript-accessible storage.

### Refresh Token Rotation

A simplified refresh flow:

```js
import { randomUUID } from 'node:crypto';

app.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const existingToken = await refreshTokens.findValid(refreshToken);

    if (!existingToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    await refreshTokens.revoke(refreshToken);

    const user = await users.findById(existingToken.userId);
    const nextRefreshToken = randomUUID();

    await refreshTokens.create({
      token: nextRefreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    });

    res.json({
      accessToken: createAccessToken(user),
      refreshToken: nextRefreshToken
    });
  } catch (error) {
    next(error);
  }
});
```

This is intentionally simplified. A real system should hash refresh tokens before storing them, track token families, detect reuse, and revoke related tokens when suspicious behavior appears.

## Use Cases

JWTs are a good fit when:

- A gateway signs a short-lived token that downstream services can verify.
- A mobile client needs a compact bearer token for API calls.
- A password reset or email verification link needs a signed, expiring payload.
- A system wants to verify claims without hitting a central session store for every request.

JWTs are not always the best fit when:

- You need immediate revocation for every session.
- The browser is the only client and cookies already solve the session problem.
- Token payloads would become large or contain sensitive data.
- Authorization changes must take effect instantly.

## Security and Production Implications

### Token Storage

Bearer tokens act like passwords while valid. If an attacker obtains one, they can use it. Avoid storing long-lived JWTs in `localStorage` because any successful cross-site scripting attack can read them.

Common options:

- Store short-lived access tokens in memory.
- Store refresh tokens in `HttpOnly`, `Secure`, `SameSite` cookies.
- Use server-side sessions for browser apps where revocation and cookie security are more important than statelessness.

### Expiration and Revocation

JWTs are self-contained. Once signed, they remain valid until expiration unless you add server-side checks such as a denylist, token version, or session lookup. This is why access tokens should usually be short-lived.

### Secrets and Key Rotation

Use strong secrets from environment variables or a secret manager. Do not commit secrets to git. Plan for key rotation by using `kid` headers or supporting multiple verification keys during a transition.

### Authorization Freshness

If a user role changes from `admin` to `member`, an existing JWT with `role: "admin"` may remain valid until it expires. For highly sensitive permissions, load current authorization data from the database instead of trusting old token claims.

## Common Mistakes

- Using `jwt.decode()` and treating the result as trusted.
- Accepting any algorithm instead of pinning expected algorithms.
- Storing sensitive data in token payloads.
- Using access tokens that last for days or weeks.
- Putting JWT secrets directly in source code.
- Forgetting to validate `iss` and `aud` in multi-system environments.
- Assuming JWTs are automatically revocable.
- Saving long-lived bearer tokens in `localStorage` without understanding XSS risk.
- Using JWTs for every auth problem when a session cookie would be simpler.

## Practical Challenge

Create an Express API with:

1. `POST /login` that returns a 15-minute access token.
2. `GET /account` protected by JWT verification middleware.
3. `POST /refresh` that exchanges a stored refresh token for a new access token.
4. `POST /logout` that revokes the current refresh token.

Add tests for:

- Missing bearer token.
- Expired token.
- Token signed with the wrong secret.
- Token with the wrong audience.
- A valid token that reaches the protected route.

## Recap

JWTs are signed claim containers. They are useful for compact, verifiable authentication data, especially when tokens are short-lived and carefully validated. They are not encrypted by default, not automatically revocable, and not a complete authorization system. Use them when their stateless verification is valuable, and design expiration, storage, rotation, and revocation intentionally.
