# Browser Performance Model

JavaScript performance is closely connected to how the browser works.

When a page loads or updates, the browser does several kinds of work:

1. Downloads resources.
2. Parses HTML, CSS, and JavaScript.
3. Runs JavaScript.
4. Calculates styles.
5. Calculates layout.
6. Paints pixels.
7. Composites layers to the screen.

Understanding this model helps you know what your code might be affecting.

## The Main Thread

Most JavaScript in the browser runs on the main thread.

The main thread also handles many rendering tasks and user interactions.

If JavaScript keeps the main thread busy, the browser may not be able to:

- respond to clicks
- update text while the user types
- scroll smoothly
- paint a new frame
- run animation callbacks on time

This is why a fast algorithm is not the only performance concern.

Code can be "correct" and still make the page feel frozen.

## Frames and Smoothness

Most screens refresh around 60 times per second.

That gives the browser about 16.7 milliseconds to prepare each frame.

If work takes longer than that, the browser may drop frames.

Dropped frames can make scrolling and animation feel choppy.

```js
// Heavy synchronous work can block the next frame.
button.addEventListener("click", () => {
  for (let i = 0; i < 100000000; i++) {
    // expensive work
  }

  message.textContent = "Done";
});
```

The text update cannot be painted until the click handler finishes.

## JavaScript, Style, Layout, and Paint

When JavaScript changes the DOM, the browser may need to update the page.

```js
card.classList.add("featured");
```

Depending on the CSS, that change can cause:

- style recalculation
- layout
- paint
- compositing

Some changes are cheaper than others.

Changing `transform` or `opacity` is often cheaper for animation than changing `width`, `height`, `top`, or `left`.

## Loading Performance

JavaScript can also affect startup.

Large scripts take time to:

- download
- parse
- compile
- execute

Until important JavaScript finishes, the page may not be interactive.

This is why bundle size and lazy loading matter.

## Runtime Performance

Runtime performance is what happens after the app has loaded.

Examples:

- filtering a large list
- rendering many DOM nodes
- validating form input on every keystroke
- sorting data after each API response
- running animation code every frame

Runtime problems often show up as delayed input, slow updates, or freezing.

## Network, CPU, Memory, and Rendering

Different performance problems have different causes.

| Area | Example Problem |
| --- | --- |
| Network | too many requests or large files |
| CPU | expensive JavaScript calculations |
| Memory | objects kept after they are no longer needed |
| Rendering | repeated layout and paint work |

The fix depends on the bottleneck.

Compressing a file will not fix a slow loop.

Memoizing a function will not fix a huge image download.

## Common Browser Tools

Modern browsers include tools for performance investigation.

Useful panels include:

- Network panel for request size and timing
- Performance panel for main-thread work
- Memory panel for leaks and heap growth
- Lighthouse for broad loading and user experience checks
- Coverage tools for unused JavaScript and CSS

You will learn more about DevTools later in this module.

## Common Mistakes

- Assuming every performance issue is caused by JavaScript execution speed.
- Forgetting that rendering work can be more expensive than the DOM change itself.
- Loading all code up front even when only part of it is needed.
- Measuring only on a powerful development machine.
- Ignoring low-end devices and slower networks.

## Summary

Browser performance is a combination of downloading, parsing, executing, rendering, and responding to users.

JavaScript often runs on the same main thread that must keep the page interactive.

Good optimization considers the full browser model, not only individual functions.
