# Module Knowledge Check

You've covered JSX, components, props, and state. Time to put it to the test.

This short quiz reviews the key ideas from this module. Take your time, read each
question carefully, and use the explanations afterwards to fill any gaps.

> You need to score **70% or higher** to complete this lesson and finish the module.
> You can retake the quiz as many times as you like - your best score counts.

## Quick Review

Before taking the quiz, make sure you can explain:

- why component names are capitalized
- how props flow from parent to child
- why props should not be mutated
- when state is more appropriate than props
- how `children` supports composition
- why list keys should be stable
- why copying props into state can create stale UI

:::quiz
question: Which component name is valid for a custom React component?
options:
  - profileCard
  - profile-card
  - ProfileCard
  - profile.card
answer: 2
explanation: Custom React components should start with a capital letter so JSX treats them as JavaScript component references instead of built-in DOM tags.
:::

:::quiz
question: What should a child component do if it needs to tell a parent that something happened?
options:
  - Mutate the parent's props directly
  - Call a callback function received through props
  - Import the parent component and edit its state
  - Change the DOM manually
answer: 1
explanation: React data flows down through props. Children communicate events upward by calling callback props supplied by the parent.
:::

:::quiz
question: Which value is usually better derived during render instead of stored in state?
options:
  - Whether a modal is open
  - The current text in an input
  - `items.length`
  - The selected tab id
answer: 2
explanation: `items.length` can be calculated from the `items` prop or state. Storing it separately risks it becoming out of sync.
:::

:::quiz
question: Why are `children` useful in React components?
options:
  - They let wrapper components accept nested UI from their callers
  - They prevent components from re-rendering
  - They turn props into state
  - They disable JSX syntax rules
answer: 0
explanation: The `children` prop lets components such as cards, modals, panels, and layouts render caller-provided nested content.
:::

:::quiz
question: What is the best key for a todo rendered in a list?
options:
  - `Math.random()`
  - The todo's stable `id`
  - The array index for every list
  - The current time
answer: 1
explanation: A stable id tied to the item's identity helps React track the same todo across inserts, deletes, and reordering.
:::

## Practice Challenge

Build a small `CourseCard` system.

Requirements:

- `CourseCard` accepts `title`, `level`, and `children`.
- `CourseCard` renders a card with the title and level.
- The parent passes a paragraph and a button as children.
- Add a `CourseList` component that renders multiple courses from an array with stable keys.
- Avoid storing derived values such as the number of courses in separate state.

Starter data:

```jsx
const courses = [
  { id: "react", title: "React Fundamentals", level: "Beginner" },
  { id: "js", title: "JavaScript Fundamentals", level: "Beginner" },
];
```

## Recap

Components are reusable functions that return JSX. Props configure components, state stores changing UI data, children enable composition, and stable keys preserve list identity.
