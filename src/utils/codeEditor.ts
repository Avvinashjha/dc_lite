import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

type EditorLanguage = 'javascript' | 'json' | 'text';

interface CreateCodeEditorOptions {
  rootId: string;
  doc?: string;
  language?: EditorLanguage;
  readOnly?: boolean;
  lineWrapping?: boolean;
  onModEnter?: () => void;
}

interface CodeEditorHandle {
  view: EditorView;
  getValue: () => string;
  setValue: (value: string) => void;
  setLanguage: (language: EditorLanguage) => void;
  destroy: () => void;
}

function currentThemeIsDark(): boolean {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

function languageExtension(language: EditorLanguage) {
  if (language === 'javascript') {
    return javascript();
  }
  if (language === 'json') {
    return javascript({ json: true });
  }
  return [];
}

const lightTheme = EditorView.theme({
  '&': {
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-text)',
  },
  '.cm-content': {
    caretColor: 'var(--color-primary)',
    lineHeight: '1.6',
    padding: '0.5rem 0',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--color-code-bg, var(--color-surface))',
    borderRight: '1px solid var(--color-border)',
    color: 'var(--color-text-light)',
    paddingRight: '4px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(37,99,235,.04)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(37,99,235,.06)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(37,99,235,.15) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(37,99,235,.12)',
    outline: '1px solid rgba(37,99,235,.3)',
  },
  '.cm-cursor': {
    borderLeftColor: 'var(--color-primary)',
    borderLeftWidth: '2px',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,.12)',
  },
  '.cm-tooltip-autocomplete ul li[aria-selected]': {
    backgroundColor: 'var(--color-primary)',
    color: '#fff',
  },
});

const darkTheme = EditorView.theme({
  '&': {
    backgroundColor: '#1e293b',
    color: '#e5e7eb',
  },
  '.cm-content': {
    caretColor: '#60a5fa',
    lineHeight: '1.6',
    padding: '0.5rem 0',
  },
  '.cm-gutters': {
    backgroundColor: '#1e293b',
    borderRight: '1px solid #374151',
    color: '#9ca3af',
    paddingRight: '4px',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(96,165,250,.08)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(96,165,250,.1)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(96,165,250,.2) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(96,165,250,.2)',
    outline: '1px solid rgba(96,165,250,.4)',
  },
  '.cm-cursor': {
    borderLeftColor: '#60a5fa',
    borderLeftWidth: '2px',
  },
  '.cm-tooltip': {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(0,0,0,.3)',
  },
  '.cm-tooltip-autocomplete ul li[aria-selected]': {
    backgroundColor: '#2563eb',
    color: '#fff',
  },
}, { dark: true });

function themeExtension() {
  return currentThemeIsDark() ? [darkTheme, oneDark] : [lightTheme];
}

export function createCodeEditor(options: CreateCodeEditorOptions): CodeEditorHandle {
  const root = document.getElementById(options.rootId);
  if (!root) {
    throw new Error('Code editor root not found: ' + options.rootId);
  }

  const mount = root.querySelector('.dc-editor__mount');
  if (!mount) {
    throw new Error('Code editor mount node missing for: ' + options.rootId);
  }

  const themeCompartment = new Compartment();
  const languageCompartment = new Compartment();
  const extensions: any[] = [
    themeCompartment.of(themeExtension()),
    languageCompartment.of(languageExtension(options.language || 'text')),
  ];

  if (options.lineWrapping) {
    extensions.push(EditorView.lineWrapping);
  }

  // Keep full editor UI (line numbers, gutters, highlight, selection) even in read-only mode.
  extensions.push(basicSetup);

  if (options.readOnly) {
    extensions.push(EditorState.readOnly.of(true), EditorView.editable.of(false));
  } else {
    extensions.push(keymap.of([indentWithTab]));

    if (options.onModEnter) {
      extensions.push(
        keymap.of([
          {
            key: 'Mod-Enter',
            run: () => {
              options.onModEnter && options.onModEnter();
              return true;
            },
          },
        ]),
      );
    }
  }

  const view = new EditorView({
    state: EditorState.create({
      doc: options.doc || '',
      extensions,
    }),
    parent: mount as HTMLElement,
  });

  const observer = new MutationObserver(() => {
    view.dispatch({
      effects: themeCompartment.reconfigure(themeExtension()),
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: (value: string) => {
      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: value,
        },
      });
    },
    setLanguage: (language: EditorLanguage) => {
      view.dispatch({
        effects: languageCompartment.reconfigure(languageExtension(language)),
      });
    },
    destroy: () => {
      observer.disconnect();
      view.destroy();
    },
  };
}
