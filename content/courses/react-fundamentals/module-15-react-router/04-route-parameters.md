# Route Parameters

Route parameters represent dynamic parts of a URL.

They let one route handle many specific resources.

```jsx
<Route path="/products/:productId" element={<ProductDetailsPage />} />
```

This route matches:

- `/products/1`
- `/products/keyboard`
- `/products/abc-123`

## Reading Params

Use `useParams`.

```jsx
import { useParams } from "react-router-dom";

function ProductDetailsPage() {
  const { productId } = useParams();

  return <h1>Product {productId}</h1>;
}
```

Route params are strings.

If you need a number, convert and validate it.

```jsx
const productIdNumber = Number(productId);

if (!Number.isInteger(productIdNumber)) {
  return <p>Invalid product ID.</p>;
}
```

## Multiple Params

```jsx
<Route path="/teams/:teamId/projects/:projectId" element={<ProjectPage />} />
```

```jsx
function ProjectPage() {
  const { teamId, projectId } = useParams();

  return (
    <p>
      Team: {teamId}, project: {projectId}
    </p>
  );
}
```

Use clear parameter names.

## Params vs Query Strings

Use path params for identity.

```txt
/products/42
/users/ava
/teams/t1/projects/p9
```

Use query strings for optional view state.

```txt
/products?category=books&page=2
/search?q=react
```

If removing the value means you no longer know which resource to show, it probably belongs in the path.

If removing the value still leaves a valid page with default state, it may belong in the query string.

## Fetching with Params

```jsx
function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(`/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setProduct(data);
        }
      });

    return () => {
      ignore = true;
    };
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return <h1>{product.name}</h1>;
}
```

Include the param in dependencies so the effect runs when the route changes.

## Optional and Catch-All Routes

React Router supports patterns for splat routes with `*`.

```jsx
<Route path="/docs/*" element={<DocsPage />} />
```

Use catch-all routes carefully. They can hide route design problems if everything is matched too broadly.

## Common Mistakes

- Forgetting that params are strings.
- Not handling invalid or missing resources.
- Leaving route params out of effect dependencies.
- Using query strings for required resource identity.
- Using vague param names like `:id` in deeply nested routes where `:projectId` would be clearer.

:::quiz
question: Which URL value is best represented as a route parameter?
options:
  - The product ID in /products/42
  - The current sort direction on a product list
  - Whether a tooltip is open
  - The text currently typed into an unsaved input
answer: 0
explanation: Route parameters are best for required resource identity. Sort direction is usually query-string state.
:::

## Recap

Route params make URLs dynamic.

Read them with `useParams`, validate them as needed, and choose between path params and query strings based on whether the value identifies the page or configures the view.

## Practice

Create routes for `/users/:userId` and `/teams/:teamId/users/:userId`.

Read the params, validate that IDs are present, and show a friendly message when the resource cannot be found.
