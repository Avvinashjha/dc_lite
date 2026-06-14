# Planning Your Project

Planning turns an idea into work you can actually finish.

You do not need a long document for a beginner JavaScript project, but you do need clear decisions.

Before coding, answer:

- What problem does this project solve?
- Who uses it?
- What can the user do in version one?
- What data does the project need?
- What should happen when something goes wrong?
- How will you know the project is complete?

## Start With a Problem Statement

A problem statement explains the project in one or two sentences.

Weak:

```text
Make an app about books.
```

Better:

```text
Build a reading tracker where users can add books, mark them as read, and filter the list by reading status.
```

The better version tells you:

- the type of project
- the user action
- the main data
- the core behavior

## Define the First Version

A common project mistake is treating every idea as required.

Instead, define a first version.

For a reading tracker, version one might include:

- add a book title and author
- display all books
- mark a book as read or unread
- delete a book
- save books in `localStorage`

Version one should not include:

- login
- social sharing
- barcode scanning
- recommendations
- cloud sync

Those are not bad ideas.

They are just too much for the first deliverable.

## Write Requirements

Requirements describe behavior in plain language.

Use short, testable statements:

- The user can add a book with a title and author.
- The app rejects empty book titles.
- The list shows unread books first.
- Clicking "Mark read" updates the book's status.
- Reloading the page keeps saved books.

Avoid vague requirements:

- The app should be nice.
- The UI should work well.
- The code should be clean.

Those are goals, but they are hard to test.

## Acceptance Criteria

Acceptance criteria define what "done" means.

For the requirement:

> The user can add a book with a title and author.

Acceptance criteria could be:

- A form has title and author inputs.
- Submitting valid values creates a new book object.
- The new book appears in the list.
- The form clears after submission.
- Empty titles show a validation message.

Acceptance criteria help you focus.

If all criteria pass, the feature is done.

## User Stories

User stories are another way to describe requirements.

They often use this format:

```text
As a user, I want to add expenses so that I can track my spending.
```

Useful user stories include a reason.

The reason helps you avoid building the wrong thing.

Example:

```text
As a student, I want to filter flashcards by topic so that I can review one subject at a time.
```

This suggests:

- flashcards need a topic
- the UI needs a filter control
- the render logic must use the selected topic

## Identify Data Early

Most JavaScript projects become easier when you identify the data model.

For a quiz app:

```js
const questions = [
  {
    id: "q1",
    prompt: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "function", "return"],
    answer: "let"
  }
];
```

For app state:

```js
const state = {
  currentQuestionIndex: 0,
  selectedAnswer: null,
  score: 0
};
```

The data model does not need to be perfect.

It should be clear enough to support version one.

## Make a Feature List

Separate features into three groups:

```text
Must have
Should have
Could have
```

For a weather dashboard:

Must have:

- search by city
- fetch current weather
- show loading, success, and error states

Should have:

- remember the last searched city
- show temperature units

Could have:

- forecast chart
- favorite cities
- theme switcher

Build the "must have" list first.

## Plan Risks

Risks are parts of the project that may be confusing or uncertain.

Examples:

- The API may require authentication.
- The browser may block requests because of CORS.
- Data saved in `localStorage` may be invalid or old.
- A large list may render slowly.
- User input may include unexpected characters.

Write down risks before coding.

Then build small experiments for the riskiest parts.

For example, before building a full API dashboard, first test whether this works:

```js
const response = await fetch("https://example.com/api/items");
const data = await response.json();
console.log(data);
```

If the API request fails, you learn that early.

## Best Practices

- Write a one-sentence project goal.
- Define version one before listing extensions.
- Use acceptance criteria for each feature.
- Identify the main data structures.
- Build risky parts early in small experiments.
- Keep a "later" list so extra ideas do not interrupt the current plan.

## Common Mistakes

- Planning a project larger than your available time.
- Treating design ideas as requirements.
- Forgetting error states.
- Choosing an API before checking its documentation.
- Starting with authentication when the core app behavior is still unclear.
- Writing code before knowing what "done" means.

## Summary

Good planning keeps projects finishable.

Define the problem, choose a small first version, write testable requirements, identify the data, and list acceptance criteria.

The better your plan, the easier it is to build one reliable feature at a time.
