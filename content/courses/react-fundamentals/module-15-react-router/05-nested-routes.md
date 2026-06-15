# Nested Routes

Nested routes let a parent route render shared UI while child routes render inside it.

This matches many real layouts:

- settings pages with a settings sidebar
- dashboards with tabs
- product pages with nested sections
- admin areas with shared navigation

## Parent Route with Outlet

```jsx
import { Outlet } from "react-router-dom";

function SettingsLayout() {
  return (
    <div className="settings-layout">
      <SettingsNav />
      <section>
        <Outlet />
      </section>
    </div>
  );
}
```

`Outlet` marks where the child route appears.

## Defining Nested Routes

```jsx
<Routes>
  <Route path="/settings" element={<SettingsLayout />}>
    <Route index element={<ProfileSettings />} />
    <Route path="billing" element={<BillingSettings />} />
    <Route path="security" element={<SecuritySettings />} />
  </Route>
</Routes>
```

These routes match:

- `/settings`
- `/settings/billing`
- `/settings/security`

The parent layout stays visible while the child changes.

## Relative Child Paths

Child route paths are usually relative.

```jsx
<Route path="billing" element={<BillingSettings />} />
```

Do not write `/settings/billing` as a child path unless you specifically want an absolute path.

Relative paths keep nested route trees easier to move.

## Nested Links

Inside `SettingsLayout`, links can be relative too.

```jsx
function SettingsNav() {
  return (
    <nav>
      <NavLink to=".">Profile</NavLink>
      <NavLink to="billing">Billing</NavLink>
      <NavLink to="security">Security</NavLink>
    </nav>
  );
}
```

`to="billing"` resolves relative to the current route.

## Nested Params

Child routes can access params from parent routes.

```jsx
<Route path="/teams/:teamId" element={<TeamLayout />}>
  <Route path="members/:memberId" element={<TeamMemberPage />} />
</Route>
```

```jsx
function TeamMemberPage() {
  const { teamId, memberId } = useParams();
  return <p>{teamId}: {memberId}</p>;
}
```

Both params are available.

## Index Routes

Use an index route for the parent's default child.

```jsx
<Route path="/projects/:projectId" element={<ProjectLayout />}>
  <Route index element={<ProjectOverview />} />
  <Route path="activity" element={<ProjectActivity />} />
  <Route path="settings" element={<ProjectSettings />} />
</Route>
```

`/projects/123` shows the overview.

## Avoid Over-Nesting

Nested routes should match nested UI.

If the UI does not share layout or route context, nesting may only make routing harder to understand.

Deep nesting can also make relative paths confusing.

## Common Mistakes

- Forgetting `Outlet` in the parent layout.
- Using absolute child paths accidentally.
- Creating nested routes when the UI is not nested.
- Forgetting an index route and showing a blank layout at the parent path.
- Assuming child routes cannot read parent params.

:::quiz
question: What happens if a parent route has child routes but its element does not render Outlet?
options:
  - The matched child route has nowhere to render
  - React Router automatically inserts the child at the top of the page
  - The browser reloads
  - Route params stop working
answer: 0
explanation: Outlet is the placeholder where nested child route elements render.
:::

## Recap

Nested routes are best when the UI is nested too.

Use parent layouts, `Outlet`, index routes, and relative child paths to keep related screens organized.

## Practice

Build a `/dashboard` route with a sidebar layout.

Add index, `/dashboard/reports`, and `/dashboard/team/:memberId` child routes. Use relative links in the sidebar.
