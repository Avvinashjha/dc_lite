# Breaking Work Into Milestones

A milestone is a small, complete step toward the final project.

Milestones prevent a project from becoming one large, confusing task.

Instead of saying:

```text
Build the whole expense tracker.
```

Say:

```text
Milestone 1: Render a hard-coded expense list.
Milestone 2: Add expenses from a form.
Milestone 3: Delete expenses.
Milestone 4: Calculate totals.
Milestone 5: Save expenses in localStorage.
```

Each milestone should produce visible progress.

## Why Milestones Matter

Milestones help you:

- avoid building too much at once
- test behavior earlier
- find bugs closer to where they were introduced
- stay motivated
- explain progress to others
- decide what to cut if time is limited

They also make refactoring safer.

It is easier to improve code after each milestone than after everything is tangled together.

## Build Vertically

A vertical slice is a small feature that goes through the whole app.

For example, "add a task" may include:

- form input
- validation
- state update
- DOM rendering
- storage update

That is better than building all HTML first, then all state, then all storage.

Vertical slices reveal integration problems early.

## Example: Todo App Milestones

Project goal:

> Build a todo app where users can add, complete, delete, filter, and save tasks.

Milestone 1: Static render

- Create a `tasks` array.
- Render the tasks to the page.
- Show completed tasks differently.

Milestone 2: Add task

- Add a form.
- Validate non-empty input.
- Create a task object.
- Re-render the list.

Milestone 3: Complete task

- Add a complete button or checkbox.
- Update the task's `completed` property.
- Re-render the list.

Milestone 4: Delete task

- Add a delete button.
- Remove the selected task.
- Re-render the list.

Milestone 5: Filter tasks

- Add filter buttons.
- Store the active filter.
- Render only matching tasks.

Milestone 6: Persist tasks

- Save tasks to `localStorage`.
- Load saved tasks on startup.
- Handle missing or invalid saved data.

## Keep a Project Board

You can track work with a simple text list:

```text
Todo
- Add form validation
- Save tasks
- Write README

Doing
- Render filtered tasks

Done
- Render initial list
- Toggle completed status
```

You do not need a complex tool.

The important part is knowing what you are working on now.

## Write Tasks as Actions

Good task names start with verbs:

- Create task form
- Validate title input
- Render empty state
- Save tasks to storage
- Handle failed API request
- Document setup steps

Weak task names are vague:

- UI
- bugs
- storage stuff
- cleanup

Action-based tasks are easier to complete.

## Estimate Small

If a task feels too large, split it.

Too large:

```text
Build quiz scoring.
```

Better:

```text
Store selected answer.
Check selected answer against correct answer.
Increment score after submit.
Show final score.
Prevent double submission.
```

Small tasks make it easier to stop and resume later.

## Define Done for Each Milestone

Every milestone should have a short "done when" statement.

Example:

```text
Done when the user can add a valid task, see it in the list, and see an error for an empty task.
```

This protects you from endless polishing.

When the milestone is done, move on.

## Best Practices

- Build one complete feature path at a time.
- Keep milestones visible and testable.
- Split tasks until each one feels manageable.
- Finish version one before extension features.
- Save working checkpoints in version control.
- Refactor between milestones, not in the middle of a broken feature.

## Common Mistakes

- Creating a huge task like "make app work."
- Building all features halfway instead of one feature fully.
- Adding extensions before the core flow works.
- Ignoring loading, empty, and error states until the end.
- Refactoring while tests or manual checks are failing.

## Summary

Milestones turn a project into a sequence of small wins.

Build vertical slices, write action-based tasks, define done clearly, and complete one milestone before starting the next.
