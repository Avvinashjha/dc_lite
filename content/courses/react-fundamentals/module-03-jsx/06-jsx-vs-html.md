# JSX vs HTML

JSX looks like HTML because it describes UI structure, but it is not HTML.

JSX is syntax inside JavaScript. React uses it to create element descriptions and then updates the DOM.

## Key Differences

HTML is a document format.

```html
<button class="primary" onclick="save()">Save</button>
```

JSX is JavaScript syntax.

```jsx
<button className="primary" onClick={save}>
  Save
</button>
```

The JSX version passes a JavaScript function reference to `onClick`. It does not store JavaScript code as a string attribute.

## Attribute Names

Many HTML attributes have different JSX names because JSX maps closely to DOM properties.

| HTML | JSX |
| --- | --- |
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` | `onClick` |
| `tabindex` | `tabIndex` |
| `maxlength` | `maxLength` |
| `readonly` | `readOnly` |

ARIA and data attributes stay dash-cased:

```jsx
<section aria-live="polite" data-section="status">
  Saved
</section>
```

## Children and Text

In HTML, everything starts as text markup that the browser parses.

In JSX, JavaScript values can become children.

```jsx
function Score({ points }) {
  return <p>Score: {points}</p>;
}
```

React escapes values inserted this way.

```jsx
const unsafe = "<img src=x onerror=alert(1) />";

function Preview() {
  return <p>{unsafe}</p>;
}
```

The browser displays the text. It does not create an image or run the handler.

## Inline Styles

HTML uses a string:

```html
<p style="color: red; font-weight: bold;">Warning</p>
```

JSX uses an object:

```jsx
<p style={{ color: "red", fontWeight: "bold" }}>
  Warning
</p>
```

The outer braces enter JavaScript mode. The inner braces create an object.

## Event Handling

HTML event attributes contain strings of code.

```html
<button onclick="save()">Save</button>
```

JSX event props receive functions.

```jsx
<button onClick={save}>Save</button>
```

If you need arguments, pass a new function:

```jsx
<button onClick={() => saveProject(project.id)}>
  Save
</button>
```

## Form Differences

React often uses controlled inputs, where the displayed value comes from state.

```jsx
import { useState } from "react";

function NameField() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

In plain HTML, the browser owns the current input value by default. In controlled React inputs, React state is the source of truth.

## dangerouslySetInnerHTML

In HTML, markup strings are parsed as HTML.

In JSX, text values are escaped by default. If you intentionally need to insert HTML, React makes the danger visible:

```jsx
function ArticleBody({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

Only use this with trusted or sanitized HTML. Rendering user-provided HTML without sanitizing it can introduce cross-site scripting vulnerabilities.

## Common Mistakes

- Copying HTML into JSX and forgetting to change `class` to `className`.
- Using string event handlers like `onclick="save()"`.
- Writing inline styles as CSS strings.
- Assuming JSX is less secure because it looks like HTML strings. Normal `{value}` rendering is escaped.
- Using `dangerouslySetInnerHTML` for convenience instead of rendering data as JSX.

:::quiz
question: Why is `{commentText}` safer than inserting an HTML string directly?
options:
  - React escapes text inserted with curly braces
  - Curly braces disable JavaScript
  - JSX cannot render user input
  - React deletes all special characters from strings
answer: 0
explanation: React escapes text values rendered with curly braces, so markup-like strings are displayed as text rather than parsed as executable HTML.
:::

## Mini Challenge

Convert this HTML-like snippet into valid JSX:

```html
<label for="email" class="field-label">
  Email
  <input id="email" maxlength="80" onchange="updateEmail()" />
</label>
```

Your JSX should use `htmlFor`, `className`, `maxLength`, and a real function reference for `onChange`.

## Recap

JSX resembles HTML, but it follows JavaScript rules. Use JSX prop names, JavaScript values, function event handlers, object styles, and React's default escaping model.
