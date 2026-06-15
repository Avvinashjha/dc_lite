# File Uploads

File uploads combine React UI state, browser APIs, network behavior, backend validation, and security.

The user experience matters because uploads can be slow, fail halfway, or involve large files.

## Basic File Input

```jsx
function AvatarUpload() {
  const [file, setFile] = useState(null);

  return (
    <input
      type="file"
      accept="image/png,image/jpeg"
      onChange={(event) => setFile(event.target.files[0] || null)}
    />
  );
}
```

The `accept` attribute helps the user choose a file, but it is not security. The server must still validate the upload.

## Upload With `FormData`

```jsx
async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("/api/avatar", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}
```

Do not manually set `Content-Type` for `FormData`. The browser adds the correct multipart boundary.

## Previewing Files

For image previews, use object URLs and clean them up.

```jsx
function ImagePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return previewUrl ? <img src={previewUrl} alt="" /> : null;
}
```

Cleaning up object URLs prevents memory leaks.

## Progress

The `fetch` API does not provide simple upload progress in all cases.

For upload progress, many apps use `XMLHttpRequest` or a library that supports progress events.

```js
function uploadWithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}
```

Progress should be treated as approximate. Networks and proxies can make it imperfect.

## Cancellation

Users should be able to cancel large uploads.

With `fetch`, use `AbortController`.

```js
const controller = new AbortController();

fetch("/api/upload", {
  method: "POST",
  body: formData,
  signal: controller.signal,
});

controller.abort();
```

For `XMLHttpRequest`, call `xhr.abort()`.

## Direct-to-Storage Uploads

Large apps often upload directly to object storage with a signed URL.

```text
client asks backend for signed upload URL
backend checks permission and returns short-lived URL
client uploads file to storage
client tells backend upload is complete
backend records metadata
```

This reduces load on your application server.

The signed URL should be short-lived and scoped to one upload.

## Server-Side Validation

The backend must validate:

- file size
- file type and MIME sniffing
- extension
- user authorization
- malware scanning if needed
- storage path safety
- image dimensions if relevant

Never trust the filename or client-provided MIME type alone.

## Common Mistakes

- Setting `Content-Type` manually when sending `FormData`.
- Trusting `accept` as validation.
- Forgetting to revoke object URLs.
- Uploading huge files through a server not designed for it.
- Not handling cancellation or retry.
- Storing files using raw user-provided filenames.

## Edge Case

If the upload succeeds but saving metadata fails, the system can have an orphaned file.

Plan cleanup or background reconciliation for direct-to-storage flows.

:::quiz
question: Why should you not manually set `Content-Type` when sending `FormData` with `fetch`?
options:
  - The browser needs to include the multipart boundary automatically
  - The request must always be JSON
  - File uploads cannot use POST
  - React will block the request
answer: 0
explanation: Multipart form data requires a boundary value. The browser sets the correct `Content-Type` when you pass `FormData`.
:::

## Practical Challenge

Build an upload component that supports:

- file selection
- client-side size warning
- image preview
- upload progress
- cancel button
- success and error states

Then list every validation that must still happen on the server.

## Recap

File uploads require careful UI state and strong backend validation.

Use `FormData` for simple uploads, progress-capable APIs when needed, signed URLs for large files, and server checks for every security-sensitive rule.
