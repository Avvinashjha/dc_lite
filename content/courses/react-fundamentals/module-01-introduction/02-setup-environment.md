# Setting Up Your Environment

Before we start building with React, let's set up a proper development environment. You'll need a few tools installed on your machine.

## Prerequisites

### Node.js

React requires Node.js for its build tools. Download and install the latest LTS version:

```bash
# Check if Node.js is installed
node --version

# Should output something like: v20.x.x
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org).

### Code Editor

We recommend **Visual Studio Code** with these extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint

## Creating a React Project

The easiest way to create a new React project is with **Vite**:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

This creates a project with:
- React 18+ configured
- Hot Module Replacement (HMR)
- Fast build times with Vite
- Development server

## Project Structure

After creating the project, you'll see:

```
my-react-app/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx        ← Main component
│   ├── index.css
│   └── main.jsx       ← Entry point
├── index.html
├── package.json
└── vite.config.js
```

### Key Files

- **`main.jsx`**: The entry point that renders your app
- **`App.jsx`**: Your main application component
- **`index.html`**: The HTML template

## Your First Edit

Open `src/App.jsx` and replace its content with:

```jsx
function App() {
  return (
    <div>
      <h1>My First React App!</h1>
      <p>If you can see this, React is working.</p>
    </div>
  );
}

export default App;
```

Save the file and check your browser - you should see the changes instantly!

:::exercise
title: Create Your React Project
description: Follow the steps above to create a new React project with Vite. Modify the App component to display your name.
starterCode: |
  function App() {
    return (
      <div>
        <h1>Hello, [Your Name]!</h1>
      </div>
    );
  }
:::

## Next Steps

Now that your environment is set up, let's build your first real component in the next lesson!
