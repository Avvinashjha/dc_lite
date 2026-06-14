# Profiling with DevTools

Profiling means recording what your application does so you can find performance bottlenecks.

Browser DevTools are the most important tools for JavaScript performance debugging.

## Start With a Reproduction

Before opening tools, make the problem reproducible.

Examples:

- "Typing in the search box freezes after 2,000 items."
- "Opening the dashboard takes six seconds."
- "Scrolling the feed stutters after loading more posts."

A clear reproduction helps you record the right moment.

## Network Panel

Use the Network panel to inspect requests.

Look for:

- large JavaScript files
- large images
- slow API responses
- duplicate requests
- requests that block rendering
- missing compression or caching headers

If startup is slow, the Network panel is often the first place to check.

## Performance Panel

The Performance panel records main-thread activity.

A typical workflow:

1. Open DevTools.
2. Go to the Performance panel.
3. Start recording.
4. Perform the slow interaction.
5. Stop recording.
6. Inspect the timeline.

Look for long tasks, expensive functions, layout work, and repeated rendering.

## Reading a Timeline

The timeline can show:

- JavaScript execution
- style recalculation
- layout
- paint
- screenshots
- long tasks
- event handlers

If a click feels slow, find the click event in the recording and inspect what ran afterward.

## CPU Throttling

Your development computer may be much faster than a user's device.

DevTools can simulate a slower CPU.

This helps reveal problems that are hidden on powerful machines.

Use throttling to test whether the page still feels responsive under realistic conditions.

## Memory Panel

Use memory tools when the page gets slower over time or memory keeps growing.

Watch for:

- detached DOM nodes
- event listeners that are never removed
- caches that grow forever
- large arrays kept after they are no longer needed
- timers that keep references alive

Memory optimization and performance optimization are connected.

More memory pressure can lead to garbage collection pauses.

## Coverage

Coverage tools show unused JavaScript and CSS on the current page.

Unused code can still cost download, parse, and compile time.

If a page loads a large amount of unused JavaScript, consider splitting or lazy loading.

## Lighthouse

Lighthouse gives broad performance suggestions.

It can point out:

- large bundles
- render-blocking resources
- image issues
- slow server responses
- layout shifts
- accessibility and best practice issues

Use Lighthouse as a guide, not as the only source of truth.

Real user workflows still need direct testing.

## Make One Change at a Time

After finding a likely bottleneck:

1. Make one focused change.
2. Measure again.
3. Compare before and after.
4. Keep the change only if it improves the real problem.

This prevents you from stacking changes without knowing which one mattered.

## Example Investigation

Problem: search input freezes on every keypress.

Possible evidence:

- Performance recording shows a long input event handler.
- The handler filters 20,000 products every keystroke.
- Rendering replaces the full result list each time.

Possible fixes:

- debounce the search
- skip searching for very short queries
- cache repeated results
- render fewer results
- move very heavy search work to a worker

The best fix depends on measurement.

## Common Mistakes

- Optimizing without a reliable reproduction.
- Looking only at code and ignoring browser recordings.
- Testing only in development mode.
- Making many changes before measuring again.
- Treating Lighthouse scores as the entire user experience.

## Summary

DevTools help you see what the browser is actually doing.

Use the Network panel for loading problems, Performance panel for main-thread and rendering issues, Memory panel for leaks, and Coverage or Lighthouse for broader clues.

Measure, change, and measure again.
