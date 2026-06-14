# Capstone Project Plan

A capstone project is a final project that combines many skills from the course.

It does not need to be huge.

It should show that you can plan, build, debug, and explain a complete JavaScript project.

## Capstone Goal

Choose one project and define it clearly:

```text
I will build a browser-based expense tracker that lets users add, delete, filter, total, and save expenses.
```

Your goal should mention:

- project type
- main user action
- main data
- important JavaScript behavior

## Required Plan Sections

Before coding, write a short plan with these sections:

```text
Project name:

Problem statement:

Version one features:

Data model:

State model:

Milestones:

Acceptance criteria:

Risks:

Manual test checklist:

Extension ideas:
```

This is enough structure for a strong beginner project.

## Example Plan

Project name:

```text
Study Card Builder
```

Problem statement:

```text
Students need a simple way to create flashcards, review them by topic, and track which cards they answered correctly.
```

Version one features:

- add a flashcard with question, answer, and topic
- show cards one at a time
- reveal the answer
- mark the answer correct or incorrect
- filter by topic
- save cards in `localStorage`

Data model:

```js
const card = {
  id: "card-1",
  question: "What does DOM stand for?",
  answer: "Document Object Model",
  topic: "browser",
  correctCount: 0,
  incorrectCount: 0
};
```

State model:

```js
const state = {
  cards: [],
  activeTopic: "all",
  currentCardIndex: 0,
  isAnswerVisible: false,
  error: null
};
```

Milestones:

1. Render hard-coded cards.
2. Add new cards from a form.
3. Review cards one at a time.
4. Mark answers correct or incorrect.
5. Filter cards by topic.
6. Save and load cards.
7. Write README and deploy.

Acceptance criteria:

- Empty questions and answers are rejected.
- Added cards appear in the review flow.
- The answer is hidden until the user reveals it.
- Correct and incorrect counts update.
- Topic filtering changes the review list.
- Refreshing the page keeps saved cards.

Risks:

- The current card index may point past the end after filtering.
- Saved data may be invalid.
- The UI may be confusing if no cards match a topic.

Manual test checklist:

- Add a valid card.
- Try adding an empty card.
- Reveal an answer.
- Mark one card correct.
- Mark one card incorrect.
- Filter by topic.
- Refresh and confirm cards remain.
- Delete or corrupt saved storage and confirm the app still loads.

Extension ideas:

- edit cards
- delete cards
- randomize review order
- import cards from JSON
- show accuracy by topic

## Build Order

A good capstone build order is:

1. Static HTML layout.
2. Hard-coded data render.
3. State update from one event.
4. Full version-one feature flow.
5. Storage or API integration.
6. Error and empty states.
7. Refactoring.
8. README.
9. Deployment.

Do not start with final styling or advanced extensions.

Make the core behavior reliable first.

## Review Your Own Project

Before calling the capstone complete, review it like another developer would.

Ask:

- Can I explain what every file does?
- Can I run the project from the README?
- Are the main functions named clearly?
- Are user inputs validated?
- Are errors shown to the user?
- Is state separate from DOM elements?
- Are secrets excluded from frontend code?
- Does the deployed version work?

If an answer is no, make a small improvement.

## Best Practices

- Choose one focused capstone.
- Write the plan before coding.
- Keep the first version small and complete.
- Use acceptance criteria as the finish line.
- Document important decisions in the README.
- Save extension ideas for after version one works.

## Common Mistakes

- Starting a capstone without a clear project goal.
- Changing the project idea halfway through.
- Building many screens with no working data flow.
- Ignoring edge cases until the last minute.
- Treating deployment as done without testing the deployed app.

## Summary

A capstone project shows that you can combine JavaScript fundamentals into a complete application.

Plan the goal, data, state, milestones, acceptance criteria, risks, and tests.

Then build the smallest reliable version and improve it step by step.
