import { formatJavaScript } from './formatJavaScript.js';
self.onmessage = async (event: MessageEvent<{ source: string }>) => {
  try { self.postMessage({ code: await formatJavaScript(event.data.source) }); }
  catch (error) { self.postMessage({ error: error instanceof Error ? error.message : 'Unable to format this code.' }); }
};
