# Project Overview

Project-based learning is where the separate parts of JavaScript start working together.

Instead of practicing one concept at a time, you build something that has a goal, users, data, events, errors, and trade-offs.

By this point in the course, you have learned enough JavaScript to build useful small applications:

- variables, values, and control flow
- functions and scope
- arrays and objects
- DOM selection and events
- JSON and browser storage
- classes, prototypes, modules, and modern syntax
- asynchronous JavaScript, promises, `fetch()`, and APIs
- error handling, debugging, and performance basics

This module shows how to combine those skills into complete projects.

## What Makes a Good Learning Project?

A good learning project is not just "something big."

It should be small enough to finish, but realistic enough to require decisions.

Good project ideas usually include:

- a clear user goal
- visible input and output
- data that changes over time
- at least one edge case
- a way to test whether it works
- room for one or two extensions after the first version

For example, a todo app is useful because it has real state:

- tasks can be added
- tasks can be completed
- tasks can be removed
- tasks can be saved
- the UI must stay in sync with the data

That is much more valuable than a page with only static text.

## Project-Based Learning Is Not Guessing

Beginners often start by opening a blank file and writing code until something happens.

That can be fun, but it often leads to messy code and unfinished projects.

Project-based learning works better when you move in stages:

1. Understand the goal.
2. Break the goal into small requirements.
3. Build the smallest useful version.
4. Test it manually and with small helper tests where practical.
5. Refactor once the behavior works.
6. Document how to run and extend it.

The order matters.

Do not try to polish architecture before you understand the behavior.

Do not deploy before you can explain what the project does.

Do not add advanced features before the basic flow is reliable.

## The Project Loop

Most small JavaScript projects follow this loop:

```text
Plan -> Build -> Test -> Debug -> Refactor -> Improve
```

The loop repeats many times.

For example:

1. Plan the "add task" feature.
2. Build a form handler.
3. Test adding a task manually.
4. Debug empty task handling.
5. Refactor task creation into a function.
6. Improve the UI message.

Then repeat for "complete task", "delete task", and "save tasks".

This keeps progress visible.

## What You Will Practice

In this module, you will learn how to:

- choose a project that matches your current skill level
- turn vague ideas into requirements
- break a project into small deliverables
- set up simple files and modules
- choose data structures for application state
- connect state to DOM rendering
- combine events, APIs, storage, and errors
- debug project behavior systematically
- test the most important logic
- refactor code without changing behavior
- check performance and security basics
- write a useful README
- plan several portfolio-ready JavaScript projects

The goal is not to memorize a single project.

The goal is to learn a repeatable process you can use for many projects.

## A Small Example

Imagine the project idea is:

> Build a browser app that tracks daily expenses.

That is still too broad.

A better first version is:

> Users can add an expense with a name and amount, see a list of expenses, and see the total.

Now you can identify the core data:

```js
const expenses = [
  { id: 1, name: "Coffee", amount: 4.5 },
  { id: 2, name: "Lunch", amount: 12 }
];
```

You can identify the main actions:

- add an expense
- delete an expense
- calculate the total
- render the list
- show validation errors

You can also identify what is not part of version one:

- user accounts
- charts
- bank imports
- currency conversion
- recurring expenses

Those may become extensions later.

## Best Practices

- Start with a small working version.
- Write requirements before writing code.
- Keep data separate from DOM elements.
- Give functions one clear job.
- Use meaningful names.
- Save working milestones with version control.
- Test important behavior before adding more features.
- Refactor after behavior is working.
- Write down setup steps while they are fresh.

## Common Mistakes

- Starting with too many features.
- Designing the UI before understanding the data.
- Mixing all code into one event listener.
- Updating the DOM without updating state.
- Updating state without re-rendering the DOM.
- Ignoring empty inputs, failed requests, and invalid data.
- Copying code without understanding it.
- Refactoring while the project is already broken.

## Summary

Project-based learning connects JavaScript concepts into real workflows.

A good project has a clear goal, changing data, user interactions, and testable behavior.

Work in small loops: plan, build, test, debug, refactor, and improve.
