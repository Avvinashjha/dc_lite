# Single Sign-On (SSO)

## Why It Matters

Single Sign-On lets users authenticate once with an identity provider and access multiple applications. For companies, SSO centralizes account lifecycle, security policies, multi-factor authentication, and access control. For users, it reduces password fatigue.

Node.js applications often support SSO for enterprise customers through OIDC or SAML. The backend must understand the identity provider, map external users to local accounts, and enforce authorization inside the application.

## Core Concepts

### Identity Provider and Service Provider

The identity provider, or IdP, authenticates the user. Examples include Okta, Azure AD, Google Workspace, and Auth0.

The service provider, or SP, is your application. It trusts identity assertions from the IdP after verifying signatures and expected metadata.

### SSO Is Authentication, Not Full Authorization

SSO proves who the user is according to the IdP. Your app still needs to decide what the user can do.

For example, an employee may authenticate successfully through Okta but still not have permission to administer billing in your app.

### Account Linking

The app needs a stable way to map IdP identities to local users. Common identifiers include OIDC `sub` plus issuer, or SAML NameID plus IdP entity ID.

Email is useful for display and invitation flows, but it may change. Treat email-only account linking carefully.

## Syntax/Examples

### Tenant-Aware SSO Start

```js
import express from 'express';
import { randomBytes } from 'node:crypto';

const app = express();
const loginStates = new Map();

const tenants = new Map([
  ['acme', {
    issuer: 'https://acme.okta.example.com',
    clientId: process.env.ACME_CLIENT_ID,
    redirectUri: 'https://app.example.com/sso/callback'
  }]
]);

app.get('/sso/:tenant/start', (req, res) => {
  const tenant = tenants.get(req.params.tenant);
  if (!tenant) return res.status(404).send('Unknown tenant');

  const state = randomBytes(16).toString('hex');
  loginStates.set(state, { tenantKey: req.params.tenant, createdAt: Date.now() });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: tenant.clientId,
    redirect_uri: tenant.redirectUri,
    scope: 'openid email profile',
    state
  });

  res.redirect(`${tenant.issuer}/oauth2/v1/authorize?${params}`);
});
```

Enterprise SSO is often tenant-specific. Each customer may have a different issuer, client ID, certificate, or metadata URL.

### Mapping an External Identity

```js
export async function findOrCreateSsoUser({ tenantId, claims, userRepository }) {
  const externalId = `${claims.iss}:${claims.sub}`;
  const existing = await userRepository.findByExternalId({ tenantId, externalId });
  if (existing) return existing;

  if (!claims.email_verified) {
    throw new Error('SSO email must be verified');
  }

  return userRepository.create({
    tenantId,
    externalId,
    email: claims.email,
    displayName: claims.name ?? claims.email
  });
}
```

This uses issuer plus subject as the stable identity key. It does not rely only on email.

## Use Cases

SSO is valuable for:

- Enterprise SaaS applications.
- Internal tools used by employees.
- Products requiring centralized access control.
- Applications that need MFA enforcement through a corporate IdP.
- Reducing password storage and reset workflows.

Common protocols:

- OIDC: modern, JSON and JWT based, common for web and API ecosystems.
- SAML: XML based, common in enterprise environments and older IdPs.

## Tradeoffs

SSO improves centralized security, but configuration can be complex. Each tenant may need metadata, redirect URIs, certificates, domains, and claim mapping. Mistakes can lock users out or accidentally grant access to the wrong tenant.

SSO also changes support workflows. If login fails, the issue may be in your app, the IdP, group assignment, certificate rotation, clock skew, or user provisioning.

## Common Mistakes

- Treating email domain alone as proof of tenant membership.
- Linking accounts by email without checking issuer and subject.
- Forgetting certificate or JWKS rotation.
- Assuming SSO roles are the same as application permissions.
- Not handling users removed from the IdP or removed from a group.

## Practical Challenge

Design SSO for a multi-tenant SaaS app. Write down what you store per tenant, how you map external identities to local users, what happens on first login, and how you remove access when an employee leaves the customer company.

## Recap

SSO centralizes authentication through an identity provider. Node apps commonly implement it with OIDC or SAML, then create their own local session and authorization model. Use stable external identifiers, tenant-aware configuration, careful token or assertion validation, and clear account lifecycle rules.

