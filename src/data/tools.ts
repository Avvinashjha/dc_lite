export interface ToolEntry {
  name: string;
  desc: string;
  href: string;
  icon: string;
}

export interface ToolCategory {
  name: string;
  icon: string;
  tools: ToolEntry[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: 'Data & API',
    icon: '{ }',
    tools: [
      { name: 'JSON Toolkit', desc: 'Format, validate, convert JSON ↔ CSV, export JavaScript or TypeScript, and compare payloads', href: '/tools/json-formatter', icon: '{ }' },
      { name: 'JWT Decoder', desc: 'Decode and inspect JSON Web Tokens', href: '/tools/jwt-decoder', icon: '🔑' },
    ],
  },
  {
    name: 'Code & Text',
    icon: '</>',
    tools: [
      { name: 'JavaScript Formatter', desc: 'Format or minify JavaScript with a side-by-side syntax-highlighted preview', href: '/tools/code-formatter', icon: 'JS' },
      { name: 'JavaScript Runner', desc: 'Write and execute JavaScript functions in a browser sandbox', href: '/tools/js-runner', icon: 'JS' },
      { name: 'Diff Checker', desc: 'Compare texts side-by-side with git-style highlighting', href: '/tools/diff-checker', icon: '±' },
      { name: 'Regex Tester', desc: 'Test regular expressions with live matching', href: '/tools/regex-tester', icon: '.*' },
      { name: 'Markdown Preview', desc: 'Write markdown with live preview and PDF export', href: '/tools/markdown-preview', icon: 'MD' },
    ],
  },
  {
    name: 'Design',
    icon: '🎨',
    tools: [
      { name: 'Color Studio', desc: 'Pick, convert, save, and export colors and gradients as CSS or SASS', href: '/tools/color-picker', icon: '🖌' },
      { name: 'QR Generator', desc: 'Generate QR codes for URLs, WiFi, email, phone', href: '/tools/qr-generator', icon: '▣' },
      { name: 'Canvas Draw', desc: 'Draw flowcharts, diagrams, and wireframes with drag-and-drop shapes', href: '/tools/canvas-draw', icon: '✏' },
    ],
  },
  {
    name: 'Developer Utilities',
    icon: '🔧',
    tools: [
      { name: 'Timestamp', desc: 'Convert Unix timestamps and timezone converter', href: '/tools/timestamp', icon: '⏱' },
      { name: 'Timezone', desc: 'Convert time between timezones with world clocks', href: '/tools/timezone', icon: '🌐' },
      { name: 'Clipboard Manager', desc: 'Save, search, and organize clipboard snippets', href: '/tools/clipboard', icon: '📋' },
    ],
  },
];

export const ALL_TOOLS: (ToolEntry & { category: string })[] = TOOL_CATEGORIES.flatMap((c) =>
  c.tools.map((t) => ({ ...t, category: c.name }))
);

export const TOOLS_COUNT = ALL_TOOLS.length;
