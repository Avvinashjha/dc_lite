# Installation

This guide covers all the ways to install and configure My Project.

## Requirements

- Node.js 18 or higher
- npm 9 or higher (or yarn/pnpm)

## Package Managers

### npm

```bash
npm install my-project
```

### yarn

```bash
yarn add my-project
```

### pnpm

```bash
pnpm add my-project
```

## Configuration

Create a `myproject.config.js` file in your project root:

```javascript
export default {
  // Source directory
  input: './src',

  // Output directory
  output: './dist',

  // Enable debug mode
  debug: false,

  // Plugin configuration
  plugins: [],
};
```

## Environment Variables

You can also configure via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `MP_INPUT` | Source directory | `./src` |
| `MP_OUTPUT` | Output directory | `./dist` |
| `MP_DEBUG` | Debug mode | `false` |

## Verifying Installation

After installation, verify it works:

```bash
npx my-project --version
```

You should see the version number printed to the console.

## Troubleshooting

### Common Issues

**Permission errors on macOS/Linux:**
```bash
sudo npm install -g my-project
```

**Node.js version mismatch:**
```bash
nvm install 20
nvm use 20
```

**Cache issues:**
```bash
npm cache clean --force
npm install
```
