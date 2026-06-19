# Typing Context

React Context is easier to use safely when the context value has a clear TypeScript type.

The main question is how to handle the initial value.

## A Nullable Context

```tsx
type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
```

Because the default is `null`, consumers must handle the missing provider case.

## A Custom Hook for Safety

```tsx
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
```

Now components can use `useAuth()` without repeating null checks.

```tsx
function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return <a href="/login">Sign in</a>;

  return <button onClick={logout}>Sign out {user.name}</button>;
}
```

## Typing the Provider

```tsx
type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    const nextUser = await loginRequest(email, password);
    setUser(nextUser);
  }

  function logout() {
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

Explicitly typing `value` helps catch missing fields.

## Reducer Context

For more complex context state, use a typed reducer.

```tsx
type ThemeState = {
  mode: "light" | "dark";
};

type ThemeAction =
  | { type: "setMode"; mode: "light" | "dark" }
  | { type: "toggle" };

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case "setMode":
      return { mode: action.mode };
    case "toggle":
      return { mode: state.mode === "light" ? "dark" : "light" };
  }
}
```

The action union prevents invalid dispatches.

## Splitting State and Actions

If many components only dispatch actions, consider separate contexts.

```tsx
const ThemeStateContext = createContext<ThemeState | null>(null);
const ThemeDispatchContext = createContext<React.Dispatch<ThemeAction> | null>(null);
```

This can reduce unnecessary re-renders in larger trees.

For small contexts, one combined value may be fine.

## Common Mistakes

- Creating a context with `{}` as a fake default value.
- Using non-null assertions everywhere instead of a safe custom hook.
- Forgetting to type `children`.
- Putting fast-changing form state in a large app-wide context.
- Exposing loosely typed dispatch actions.

:::quiz
question: Why is a custom `useAuth` hook useful for a nullable context?
options:
  - It turns Context into Redux
  - It centralizes the provider check and returns a non-null value
  - It prevents components from rendering children
  - It validates API responses at runtime
answer: 1
explanation: The custom hook checks for a missing provider once, so consumers get a properly typed context value.
:::

## Practical Challenge

Create a typed `ThemeContext`.

Include:

- `mode: "light" | "dark"`
- `setMode(mode)`
- `toggleMode()`
- a custom `useTheme()` hook that throws if used outside the provider

Then explain when you might split the state and actions into separate contexts.

## Recap

Typed Context protects shared values from drifting into unclear shapes.

Prefer nullable context plus a custom hook, type provider children, and use typed reducer actions when context state has multiple transitions.
