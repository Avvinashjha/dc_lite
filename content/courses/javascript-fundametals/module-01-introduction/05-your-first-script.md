# Your First Script

Now that your environment is ready, it is time to write and run your first JavaScript program.

The traditional starting point is **Hello, World!**. It is simple, but it teaches the full flow: create files, connect JavaScript to HTML, run the page, and inspect the output.

## Step 1: Create Your Project Files

Open VS Code and create a new folder for this lesson.

You can name it:

```text
my-first-js-project
```

Inside that folder, create two files:

```text
my-first-js-project/
├── index.html
└── script.js
```

The `index.html` file is your webpage. The `script.js` file is where your JavaScript code will live.

## Step 2: Set Up the HTML File

Open `index.html` and add this code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My First JavaScript Script</title>
  </head>
  <body>
    <h1>Check the Console!</h1>

    <script src="script.js"></script>
  </body>
</html>
```

The important line is:

```html
<script src="script.js"></script>
```

This tells the browser to load and run the JavaScript file named `script.js`.

We place the `<script>` tag near the end of the `<body>` so the HTML content loads before the script runs. This is a simple and reliable pattern for beginners.

You can write JavaScript directly inside an HTML file, but keeping JavaScript in a separate `.js` file is cleaner and easier to maintain.

## Step 3: Write Your First JavaScript Code

Open `script.js` and add this line:

```js
console.log("Hello, World! Welcome to JavaScript.");
```

This is your first JavaScript statement.

## What Is `console.log()`?

`console.log()` prints a message to the developer console.

It has two parts:

- `console`: A built-in object available in browsers and Node.js
- `log()`: A method that prints a value

Developers use `console.log()` constantly while learning, testing, and debugging code.

For example:

```js
console.log("JavaScript is running");
console.log(100);
console.log(true);
```

## Step 4: Run Your Script in the Browser

The browser is the best place to run JavaScript when you are working with webpages.

To run your script:

1. Open `index.html` in Chrome, Firefox, Edge, or Safari.
2. Open Developer Tools.
3. Go to the **Console** tab.
4. Look for this output:

```text
Hello, World! Welcome to JavaScript.
```

Developer Tools shortcuts:

- **Windows/Linux**: `F12` or `Ctrl + Shift + I`
- **macOS**: `Cmd + Option + I`

If you installed the **Live Server** extension in VS Code, you can right-click `index.html` and choose **Open with Live Server**. This starts a local server and refreshes the browser when files change.

## Step 5: Run Your Script with Node.js

If you installed Node.js, you can run the same JavaScript file from the terminal.

Open a terminal in your project folder and run:

```bash
node script.js
```

You should see:

```text
Hello, World! Welcome to JavaScript.
```

This works because `script.js` only uses `console.log()`, which is available in both browsers and Node.js.

Not all browser JavaScript works in Node.js. For example, `document` and `window` are browser-only APIs.

## Step 6: Change the Message

Now edit `script.js`:

```js
console.log("My name is Alex, and I am learning JavaScript.");
```

Run the file again in the browser or terminal.

If the output changes, your setup is working correctly.

## Three Basic Syntax Rules

Before moving on, remember these beginner rules.

### JavaScript Is Case-Sensitive

Capital letters matter.

This works:

```js
console.log("Correct");
```

This does not:

```js
Console.Log("Wrong");
```

`console.log`, `Console.Log`, and `console.Log` are all different names to JavaScript.

### Statements Usually End with Semicolons

A statement is a line of code that performs an action.

```js
console.log("This is a statement");
```

JavaScript can often insert semicolons automatically, but using semicolons consistently is a good habit while learning.

### Comments Are Ignored by JavaScript

Comments are notes for humans. JavaScript ignores them when running the program.

Single-line comment:

```js
// This prints a greeting
console.log("Hello!");
```

Multi-line comment:

```js
/*
  This comment can span
  multiple lines.
*/
console.log("Done");
```

## Common Mistakes

If you do not see the message in the console, check these things:

- Make sure the file is named exactly `script.js`.
- Make sure `index.html` contains `<script src="script.js"></script>`.
- Make sure `script.js` is in the same folder as `index.html`.
- Make sure you are looking at the browser **Console** tab, not the Elements tab.
- Refresh the browser after saving your changes.

## Summary

You just created a small JavaScript project, linked an external script file, printed output with `console.log()`, and ran the same file in both the browser and Node.js.

That is the basic workflow you will use again and again:

1. Write JavaScript in a `.js` file.
2. Run it in the browser or terminal.
3. Check the output.
4. Change the code and run it again.