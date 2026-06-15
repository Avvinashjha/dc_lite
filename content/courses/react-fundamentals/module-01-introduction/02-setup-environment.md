# Setting Up Your Environment

React itself is a library, but modern React development uses build tools.

For this course, Vite is the simplest way to create a fast local React project.

## Prerequisites

### Node.js

Install the current LTS version of Node.js.

Check your version:

```bash
node --version
npm --version
```

You should see version numbers. If the commands are missing, install Node.js from [nodejs.org](https://nodejs.org) or through a version manager such as `nvm`.

Node is needed for:

- installing packages
- running the development server
- compiling JSX
- creating production builds

React code runs in the browser, but the tooling runs through Node.

### Editor

Use an editor that understands JavaScript, JSX, formatting, and linting.

Helpful tools include:

- ESLint for catching common mistakes
- Prettier for consistent formatting
- React-aware syntax highlighting
- TypeScript support if you later use TypeScript

## Create a React Project with Vite

Run:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

Vite prints a local URL, often `http://localhost:5173/`.

Open it in the browser. When you edit files under `src`, Vite updates the page quickly with hot module replacement.

## Project Structure

A new Vite React app usually looks like this:

```txt
my-react-app/
  public/
  src/
    App.css
    App.jsx
    index.css
    main.jsx
  index.html
  package.json
  vite.config.js
```

Important files:

- `index.html` contains the root DOM node and script entry.
- `src/main.jsx` creates the React root and renders the app.
- `src/App.jsx` contains the starter app component.
- `package.json` lists scripts and dependencies.

## The Entry Point

Open `src/main.jsx`.

You will usually see something like:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`createRoot` connects React to the DOM node in `index.html`.

`StrictMode` helps catch unsafe patterns during development. It can make some logs appear twice locally. That is expected development behavior, not a production double render.

## Your First Edit

Replace `src/App.jsx` with:

```jsx
function App() {
  return (
    <main>
      <h1>My First React App</h1>
      <p>If you can see this, React is working.</p>
    </main>
  );
}

export default App;
```

Save the file and check the browser. The page should update automatically.

## Development and Production Commands

Common Vite scripts:

```bash
npm run dev
npm run build
npm run preview
```

`npm run dev` starts the local development server.

`npm run build` creates optimized production files.

`npm run preview` serves the production build locally so you can inspect it.

## Troubleshooting

If the app does not start:

- Make sure you ran `npm install`.
- Check that you are inside the project folder.
- Stop any other app using the same port, or use the alternate port Vite suggests.
- Read the terminal error carefully. JSX syntax errors usually include a file and line.

If the page is blank:

- Open the browser console.
- Check that `index.html` has `<div id="root"></div>`.
- Check that `main.jsx` imports the right `App` file.
- Make sure the component returns valid JSX.

## Common Mistakes

- Editing `index.html` when the actual starter UI is in `src/App.jsx`.
- Running `npm run dev` before installing dependencies.
- Calling `createRoot` from inside a component.
- Deleting the `export default App`.
- Ignoring browser console errors.

:::quiz
question: What is the purpose of `src/main.jsx` in a Vite React app?
options:
  - It defines every component in the app
  - It creates the React root and renders the top-level component
  - It stores production CSS only
  - It replaces `package.json`
answer: 1
explanation: The entry file imports React DOM's `createRoot`, finds the root DOM element, and renders the app component tree into it.
:::

:::exercise
title: Create Your React Project
description: Create a new React project with Vite, run the dev server, and replace the starter App component with your own heading and paragraph.
starterCode: |
  function App() {
    return (
      <main>
        <h1>Hello, [Your Name]</h1>
        <p>This is my first React app.</p>
      </main>
    );
  }

  export default App;
:::

## Recap

A React project needs Node-based tooling for development. Vite gives you a fast setup with `main.jsx` as the entry point, `App.jsx` as the starter component, and commands for development and production builds.
