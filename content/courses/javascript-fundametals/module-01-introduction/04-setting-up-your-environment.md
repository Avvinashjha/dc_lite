# Setting Up Your Environment

One of the best things about JavaScript is how easy it is to start. You do not need a heavy compiler or complex setup for your first programs. A browser is enough to run JavaScript, and a small set of tools will make the learning experience much smoother.

In this lesson, you will set up the standard beginner-friendly environment for writing and running JavaScript.

## 1. Install a Code Editor

You could write JavaScript in a basic text editor, but a proper code editor makes coding much easier. It gives you syntax highlighting, autocomplete, formatting, and helpful error hints.

The recommended editor is **Visual Studio Code (VS Code)**.

- It is free and widely used in the industry.
- It has excellent JavaScript support.
- It has a large extension ecosystem.

Download it from [code.visualstudio.com](https://code.visualstudio.com/).

### Helpful VS Code Extensions

After installing VS Code, these extensions are useful for JavaScript beginners:

- **Live Server**: Starts a local development server and refreshes the browser when your files change.
- **Prettier**: Formats your code automatically so it stays clean and consistent.
- **JavaScript (ES6) code snippets**: Adds shortcuts for common JavaScript patterns.

You do not need many extensions at the beginning. Start small, then add tools when you understand why you need them.

## 2. Use a Modern Web Browser

Because JavaScript was created for the web, your browser is one of the best places to run and test it.

Recommended browsers:

- **Google Chrome**
- **Mozilla Firefox**
- **Microsoft Edge**
- **Safari** on macOS

Chrome and Firefox are especially popular for learning because their developer tools are excellent.

### Open Developer Tools

Developer Tools let you inspect webpages, debug code, and run JavaScript directly in the browser console.

Use these shortcuts:

- **Windows/Linux**: `F12` or `Ctrl + Shift + I`
- **macOS**: `Cmd + Option + I`

Then open the **Console** tab. You can type JavaScript there and press Enter to run it.

Try this:

```js
console.log("Hello from the browser!");
```

The console is also where you will see output from `console.log()` in your own JavaScript files.

## 3. Install Node.js

Node.js is a runtime environment that lets you run JavaScript outside the browser.

You do not strictly need Node.js for your first browser examples, but it is highly recommended because modern JavaScript development uses it heavily.

Node.js is useful because:

1. You can run JavaScript files directly from the terminal.
2. It includes **npm**, the Node Package Manager.
3. npm lets you install libraries, frameworks, and build tools later.

Download the **LTS** version from [nodejs.org](https://nodejs.org/). LTS means Long Term Support, which is the stable version recommended for most users.

### Verify Node.js

After installation, open your terminal and run:

```bash
node -v
npm -v
```

If both commands print version numbers, Node.js and npm are installed correctly.

You can also run JavaScript directly from the terminal:

```bash
node
```

Then type:

```js
console.log("Hello from Node.js!");
```

Press `Ctrl + C` twice to exit the Node.js prompt.

## 4. Create Your First Project Folder

Good file organization matters, even for small projects. A simple beginner JavaScript project usually has three files:

```text
my-first-js-project/
├── index.html
├── style.css
└── script.js
```

Here is what each file does:

- `index.html`: The main webpage
- `style.css`: Optional styling for the page
- `script.js`: Your JavaScript code

## 5. Connect JavaScript to HTML

To run JavaScript in the browser, you usually connect your `script.js` file to your HTML file.

Create an `index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First JavaScript Project</title>
  </head>
  <body>
    <h1>Hello JavaScript</h1>

    <script src="script.js"></script>
  </body>
</html>
```

Then create a `script.js` file:

```js
console.log("JavaScript is connected!");
```

Open `index.html` in your browser, open Developer Tools, and check the Console tab. You should see the message from your JavaScript file.

## Browser vs Node.js

You now have two ways to run JavaScript:

| Environment | Best for | Example |
| --- | --- | --- |
| Browser | Webpages, DOM, user interactions | `document.querySelector("h1")` |
| Node.js | Terminal scripts, servers, tools | `node script.js` |

Both run JavaScript, but they provide different APIs. The browser gives you `document` and `window`. Node.js gives you APIs like `fs`, `http`, and `process`.

## Setup Checklist

Before moving on, make sure you have:

1. Installed **VS Code**.
2. Installed useful extensions like **Live Server** and **Prettier**.
3. Opened the browser **Console** and tested a simple `console.log()`.
4. Installed **Node.js LTS**.
5. Verified Node.js with `node -v` and npm with `npm -v`.
6. Created a simple project folder with `index.html` and `script.js`.

Once this setup is ready, you can write and run JavaScript like a real developer.