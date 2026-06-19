# List Virtualization

List virtualization renders only the visible part of a large list.

Instead of putting 10,000 rows in the DOM, the app might render 30 rows and update them as the user scrolls.

## Why Large Lists Are Expensive

Large lists can cost time in several places:

- React rendering many components
- creating many DOM nodes
- browser layout and paint work
- event handlers and effects in each row
- memory usage

Even simple rows can become expensive when repeated thousands of times.

## The Basic Idea

Virtualization uses a scroll container with a large total height and renders a window of items.

```jsx
function SimpleVirtualList({ items, rowHeight, height }) {
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const visibleCount = Math.ceil(height / rowHeight);
  const visibleItems = items.slice(startIndex, startIndex + visibleCount + 1);

  return (
    <div
      style={{ height, overflow: "auto" }}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div style={{ height: items.length * rowHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;

          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                top: itemIndex * rowHeight,
                height: rowHeight,
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

In production, use a well-tested library rather than writing all details yourself.

Common libraries include `react-window` and similar virtualization tools.

## Fixed vs Dynamic Row Heights

Fixed row heights are simpler and faster.

Dynamic row heights are harder because the list must measure rows and update positions.

If your design allows it, use consistent row heights.

## Overscan

Virtualized lists often render a few extra items before and after the visible range.

This is called overscan.

Overscan reduces blank space during fast scrolling, but too much overscan reduces the performance benefit.

## Accessibility and Find-in-Page

Virtualization has tradeoffs.

Because not all items are in the DOM:

- browser find-in-page may not find hidden items
- screen reader behavior needs testing
- keyboard navigation must be handled carefully
- scroll position can be tricky when data changes

Do not virtualize small lists just because it sounds advanced.

## Pagination vs Virtualization

Pagination reduces how much data the user sees at once.

Virtualization keeps the feeling of one long list while reducing DOM work.

Use pagination when users naturally think in pages or server queries.

Use virtualization when users need smooth scrolling through many rows.

## Common Mistakes

- Virtualizing lists that are not actually large.
- Using unstable keys and causing row state bugs.
- Ignoring dynamic height complexity.
- Forgetting accessibility and keyboard navigation.
- Rendering expensive row contents without memoization.
- Fetching all data up front when server-side pagination is the real need.

:::quiz
question: What does list virtualization primarily reduce?
options:
  - The number of DOM nodes and row components rendered at one time
  - The size of every API response automatically
  - The need for stable keys
  - The cost of all calculations outside the list
answer: 0
explanation: Virtualization keeps only a window of list items rendered, reducing DOM and rendering work for large lists.
:::

## Recap

Virtualization is a strong tool for large scrolling lists.

Use it when list size causes real rendering or DOM performance problems, and account for accessibility, row height, keys, and data loading.

## Practice

Render 5,000 rows normally and observe scrolling performance.

Then replace the list with a virtualized version and compare DOM node count, scroll smoothness, and keyboard behavior.
