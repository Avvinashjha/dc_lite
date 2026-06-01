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
    name: 'JSON Tools',
    icon: '{ }',
    tools: [
      { name: 'JSON Formatter', desc: 'Format, validate, minify with multi-tab support', href: '/tools/json-formatter', icon: '{ }' },
      { name: 'JSON Diff', desc: 'Compare JSON objects side-by-side with saved tabs', href: '/tools/json-diff', icon: '⇄' },
      { name: 'CSV ↔ JSON', desc: 'Convert between CSV and JSON formats', href: '/tools/csv-json', icon: '↹' },
    ],
  },
  {
    name: 'Code & Text',
    icon: '</>',
    tools: [
      { name: 'Code Formatter & Preview', desc: 'Format/minify code with side-by-side CodeMirror preview', href: '/tools/code-formatter', icon: '</>' },
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
      { name: 'Color Picker', desc: 'Pick colors, gradients, save palettes, export CSS/SASS', href: '/tools/color-picker', icon: '🖌' },
      { name: 'Color Converter', desc: 'Convert between HEX, RGB, and HSL', href: '/tools/color-converter', icon: '🎨' },
      { name: 'QR Generator', desc: 'Generate QR codes for URLs, WiFi, email, phone', href: '/tools/qr-generator', icon: '▣' },
      { name: 'Canvas Draw', desc: 'Draw flowcharts, diagrams, and wireframes with drag-and-drop shapes', href: '/tools/canvas-draw', icon: '✏' },
    ],
  },
  {
    name: 'Developer Utilities',
    icon: '🔧',
    tools: [
      { name: 'JWT Decoder', desc: 'Decode and inspect JSON Web Tokens', href: '/tools/jwt-decoder', icon: '🔑' },
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
