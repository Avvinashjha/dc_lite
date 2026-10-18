/** The parser and its worker are fetched only on the first format request. */
export function formatProblemCode(source: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./problemFormat.worker.ts', import.meta.url), { type: 'module' });
    const finish = () => { clearTimeout(timeout); worker.terminate(); };
    const timeout = setTimeout(() => { finish(); reject(new Error('Formatting took too long. Your code has not changed.')); }, 15000);
    worker.onmessage = event => {
      finish();
      if (event.data.error) reject(new Error(event.data.error));
      else resolve(event.data.code);
    };
    worker.onerror = () => { finish(); reject(new Error('The formatter could not load. Your code has not changed.')); };
    worker.postMessage({ source });
  });
}
