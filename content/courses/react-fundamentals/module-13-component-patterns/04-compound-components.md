# Compound Components

Compound components are components designed to work together under a shared parent.

They let users write expressive JSX while the parent coordinates shared state.

Common examples include:

- tabs
- accordions
- menus
- radio groups
- select components
- dialogs

## The Goal

Instead of this:

```jsx
<Tabs
  tabs={[
    { label: "Profile", content: <Profile /> },
    { label: "Billing", content: <Billing /> },
  ]}
/>
```

you can offer this:

```jsx
<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="profile"><Profile /></Tabs.Panel>
  <Tabs.Panel value="billing"><Billing /></Tabs.Panel>
</Tabs>
```

The markup is flexible, but the pieces still share behavior.

## Using Context

Compound components often use context internally.

```jsx
const TabsContext = React.createContext(null);

function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      {children}
    </TabsContext.Provider>
  );
}
```

Child components read the shared state.

```jsx
function TabsTrigger({ value, children }) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs.Trigger must be used inside Tabs");
  }

  const selected = context.value === value;

  return (
    <button
      aria-selected={selected}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}
```

Attach child components as properties for a clear API.

```jsx
Tabs.Trigger = TabsTrigger;
```

## Controlled and Uncontrolled Compound Components

Reusable components often support two modes.

Uncontrolled:

```jsx
<Tabs defaultValue="profile">...</Tabs>
```

The component owns its state.

Controlled:

```jsx
<Tabs value={tab} onValueChange={setTab}>...</Tabs>
```

The parent owns the state.

A component can support both:

```jsx
function Tabs({ value, defaultValue, onValueChange, children }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  function selectValue(nextValue) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
  }

  return (
    <TabsContext.Provider value={{ value: selectedValue, selectValue }}>
      {children}
    </TabsContext.Provider>
  );
}
```

Avoid switching between controlled and uncontrolled mode after mount. Pick one for the lifetime of the component.

## Accessibility Matters

Compound components often represent interactive widgets.

Use semantic HTML and ARIA carefully.

For tabs, think about:

- `role="tablist"`
- `role="tab"`
- `role="tabpanel"`
- keyboard navigation
- focus management
- linking triggers to panels with IDs

The pattern is not just about API shape. It also needs correct behavior.

## Common Mistakes

- Building a compound API before the component needs that flexibility.
- Forgetting to handle missing context with a helpful error.
- Mixing controlled and uncontrolled state accidentally.
- Making child components depend on fragile child order.
- Ignoring accessibility requirements for menus, tabs, and dialogs.

:::quiz
question: In a controlled compound component, where does the selected value live?
options:
  - In the parent component that passes value and onValueChange
  - Only inside the compound component's internal state
  - In the DOM as a data attribute
  - In React.memo
answer: 0
explanation: Controlled components receive their value from the parent and notify changes through callbacks.
:::

## Recap

Compound components create flexible component families with shared state.

They are powerful for UI primitives, but they require careful API design, context handling, and accessibility.

## Practice

Build an uncontrolled `Accordion` with `Accordion.Item`, `Accordion.Header`, and `Accordion.Panel`.

Then add a controlled `value` and `onValueChange` API.
