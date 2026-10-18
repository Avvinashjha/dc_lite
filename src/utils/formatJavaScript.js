// This module runs inside the on-demand formatter worker, and in its regression tests.
let modules;
export async function formatJavaScript(source, options = {}) {
  if (source.length > 200_000) throw new Error('Formatting is limited to 200 KB of code.');
  modules ||= Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
  ]).catch(error => { modules = undefined; throw error; });
  const [prettier, babel, estree] = await modules;
  return prettier.format(source, {
    parser: 'babel', plugins: [babel, estree], tabWidth: options.tabWidth || 2, printWidth: 90,
    semi: true, singleQuote: true, embeddedLanguageFormatting: 'off',
  });
}
