# API Reference

Complete reference for the My Project API.

## Constructor

### `new MyProject(options)`

Creates a new instance of MyProject.

```javascript
import { MyProject } from 'my-project';

const app = new MyProject({
  input: './src',
  output: './dist',
  debug: false,
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `string` | `'./src'` | Source directory |
| `output` | `string` | `'./dist'` | Output directory |
| `debug` | `boolean` | `false` | Enable debug logging |
| `plugins` | `Plugin[]` | `[]` | Array of plugins |

## Methods

### `app.build()`

Builds the project.

```javascript
const result = await app.build();

console.log(result.files);    // Number of files processed
console.log(result.duration);  // Build duration in ms
```

**Returns:** `Promise<BuildResult>`

### `app.watch()`

Starts watching for file changes and rebuilds automatically.

```javascript
const watcher = app.watch();

watcher.on('change', (file) => {
  console.log(`File changed: ${file}`);
});

// Stop watching
watcher.close();
```

**Returns:** `Watcher`

### `app.clean()`

Removes the output directory.

```javascript
await app.clean();
```

**Returns:** `Promise<void>`

## Events

MyProject emits events during the build process:

```javascript
app.on('build:start', () => {
  console.log('Build started');
});

app.on('build:complete', (result) => {
  console.log(`Built ${result.files} files`);
});

app.on('build:error', (error) => {
  console.error('Build failed:', error);
});
```

### Event List

| Event | Payload | Description |
|-------|---------|-------------|
| `build:start` | none | Build process started |
| `build:complete` | `BuildResult` | Build completed successfully |
| `build:error` | `Error` | Build encountered an error |
| `file:change` | `string` | A source file was modified |

## Plugins

Plugins extend My Project's functionality:

```javascript
const myPlugin = {
  name: 'my-plugin',
  setup(app) {
    app.on('build:start', () => {
      console.log('Custom plugin: build starting!');
    });
  },
};

const app = new MyProject({
  plugins: [myPlugin],
});
```
