import { EditorView, keymap } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { indentWithTab, isolateHistory } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

type EditorLanguage = 'javascript' | 'json' | 'text';

interface CreateCodeEditorOptions {
  rootId: string;
  doc?: string;
  language?: EditorLanguage;
  readOnly?: boolean;
  lineWrapping?: boolean;
  onModEnter?: () => void;
  onDocChange?: () => void;
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
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, transparent)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
    outline: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
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
    color: 'var(--color-on-primary)',
  },
});

const darkTheme = EditorView.theme({
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
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, transparent)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
  },
  '.cm-selectionBackground': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
    outline: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
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
    color: 'var(--color-on-primary)',
  },
}, { dark: true });


const codeHighlighting = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword, color: 'var(--color-purple)' },
  { tag: [tags.string, tags.regexp], color: 'var(--color-success)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--color-warning)' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName), tags.typeName], color: 'var(--color-info)' },
  { tag: tags.comment, color: 'var(--color-text-light)', fontStyle: 'italic' },
  { tag: [tags.operator, tags.operatorKeyword], color: 'var(--color-primary)' },
]));

function themeExtension() {
  return [currentThemeIsDark() ? darkTheme : lightTheme, codeHighlighting];
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

  if (options.onDocChange) {
    extensions.push(EditorView.updateListener.of(update => {
      if (update.docChanged) options.onDocChange?.();
    }));
  }

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
        annotations: isolateHistory.of('full'),
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
