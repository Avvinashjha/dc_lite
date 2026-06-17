# File Uploads and Storage

## Why It Matters

File uploads are one of the riskiest features in a web application because they accept large, user-controlled input and often store it for later download. A careless upload endpoint can fill disk space, overwrite files, expose private documents, serve malware, or allow path traversal attacks.

Node.js is well suited for upload workflows because streams let you process data without loading entire files into memory. The important part is designing the upload boundary: size limits, allowed types, safe filenames, storage location, access control, and cleanup.

## Core Concepts

### Multipart Forms

Browsers usually send file uploads as `multipart/form-data`. Express does not parse multipart bodies by default. You need middleware such as `multer`, `busboy`, or `formidable`.

Basic HTML upload form:

```html
<form action="/uploads/avatar" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" accept="image/png,image/jpeg" />
  <button type="submit">Upload</button>
</form>
```

The `enctype` matters. Without it, the browser will not send the file as multipart content.

### Files Are Untrusted Input

Do not trust:

- The original filename.
- The file extension.
- The browser-provided MIME type.
- The file size declared by the client.
- Image dimensions until parsed by a trusted library.

Treat uploaded files as hostile until validated.

### Storage Options

Common storage options include:

- Local disk: simple for development, but awkward with multiple servers and deployments.
- Object storage: S3, Cloudflare R2, Google Cloud Storage, or Azure Blob Storage. Better for production scale.
- Database blobs: sometimes useful for small internal files, but often expensive and less convenient for large media.
- Temporary storage: useful for processing files before moving them to a permanent location.

Production systems commonly store the file in object storage and store metadata in a database.

## Syntax and Examples

### Installing Multer

```bash
npm install multer
```

### Uploading to Local Disk

This example accepts a single avatar image, stores it with a generated filename, and limits file size.

```js
import express from 'express';
import multer from 'multer';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/avatars',
  filename(_req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(_req, file, callback) {
    const allowedTypes = new Set(['image/png', 'image/jpeg']);

    if (!allowedTypes.has(file.mimetype)) {
      return callback(new Error('Only PNG and JPEG files are allowed'));
    }

    callback(null, true);
  }
});

app.post('/uploads/avatar', upload.single('avatar'), async (req, res) => {
  res.status(201).json({
    file: {
      storedName: req.file.filename,
      size: req.file.size,
      contentType: req.file.mimetype
    }
  });
});
```

This is useful for learning, but local disk storage has production limitations. If the app runs in multiple containers, the file may only exist on one container. If the container is replaced, the file may disappear unless the upload directory is backed by persistent storage.

### Safer Static Serving

Serving uploads directly can expose files that should be private. For public files, mount a specific upload directory instead of serving your entire project.

```js
import express from 'express';
import path from 'node:path';

const app = express();
const uploadRoot = path.resolve('uploads/public');

app.use('/public-files', express.static(uploadRoot, {
  immutable: true,
  maxAge: '1h'
}));
```

Do not expose private documents through `express.static`. For private files, authorize the request first, then stream the file.

### Streaming a Private Download

```js
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const privateRoot = path.resolve('uploads/private');

app.get('/documents/:id/download', requireUser, async (req, res, next) => {
  try {
    const document = await documents.findById(req.params.id);

    if (!document || document.ownerId !== req.user.id) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const absolutePath = path.resolve(privateRoot, document.storedName);

    if (!absolutePath.startsWith(`${privateRoot}${path.sep}`)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    const fileStat = await stat(absolutePath);

    res.setHeader('Content-Type', document.contentType);
    res.setHeader('Content-Length', fileStat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${document.downloadName}"`);

    createReadStream(absolutePath).pipe(res);
  } catch (error) {
    next(error);
  }
});
```

The `path.resolve` and `startsWith` check helps prevent path traversal when a stored filename is unexpectedly unsafe. The better design is to generate stored names yourself and never store user-controlled paths.

### Uploading to Object Storage

Many production apps upload to object storage. The exact SDK differs by provider, but the flow is similar:

```js
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';

const s3 = new S3Client({ region: process.env.AWS_REGION });

app.post('/uploads/avatar', upload.single('avatar'), requireUser, async (req, res, next) => {
  try {
    const key = `avatars/${req.user.id}/${randomUUID()}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.UPLOAD_BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }));

    await users.updateAvatar(req.user.id, { storageKey: key });

    res.status(201).json({ key });
  } catch (error) {
    next(error);
  }
});
```

For larger files, prefer streaming uploads or direct-to-storage browser uploads using pre-signed URLs. Memory storage is convenient, but it loads the entire file into memory.

## Validation Strategies

### Check Size

Set hard limits in upload middleware and at the reverse proxy or load balancer. Application limits alone may not protect your infrastructure from very large requests.

### Check Type

MIME type is only a hint. For stronger validation, inspect file signatures using a library such as `file-type`:

```js
import { fileTypeFromBuffer } from 'file-type';

async function assertImage(buffer) {
  const type = await fileTypeFromBuffer(buffer);
  const allowed = new Set(['image/png', 'image/jpeg']);

  if (!type || !allowed.has(type.mime)) {
    throw new Error('Invalid image file');
  }
}
```

### Normalize Metadata

Store controlled metadata:

- Generated storage key.
- Original display name, sanitized for display only.
- Content type after validation.
- File size.
- Owner ID.
- Visibility.
- Created timestamp.

Do not use the original filename as the actual storage path.

## Use Cases

File upload workflows include:

- User avatars and profile images.
- PDFs and private documents.
- CSV imports.
- Product images.
- Support ticket attachments.
- Audio or video uploads.
- Generated report downloads.

Each use case has different constraints. An avatar endpoint should probably allow only small images. A CSV import endpoint may accept text files, scan rows, and report validation errors. A private document system needs strong authorization and audit logging.

## Security and Production Implications

### Malware and Content Scanning

For user-shared files, consider virus scanning before making files available to other users. This is especially important for public downloads, enterprise document sharing, and support ticket attachments.

### Public vs Private Files

Public files can be served by a CDN. Private files should require authorization. With object storage, private downloads are often handled by short-lived signed URLs generated only after the app checks permissions.

### Cleanup

Uploads can fail halfway through. Database writes can fail after the file is stored. Users can delete records while files remain in storage. Plan cleanup jobs for orphaned temporary and permanent files.

### Backpressure and Memory

Avoid loading large files into memory when you can stream them. Memory storage is acceptable for small files and image validation, but large uploads should use streaming parsers or direct-to-storage uploads.

## Common Mistakes

- Accepting unlimited file sizes.
- Trusting the original filename.
- Storing uploads inside source-controlled directories.
- Serving private uploads with `express.static`.
- Checking only file extension and not actual content.
- Using memory storage for large files.
- Forgetting cleanup for failed uploads or deleted records.
- Returning raw storage paths in API responses.
- Allowing users to overwrite files by choosing the same filename.

## Practical Challenge

Build an authenticated avatar upload route:

1. Accept only one file named `avatar`.
2. Allow PNG and JPEG only.
3. Limit size to 2 MB.
4. Generate the storage filename with `randomUUID`.
5. Store metadata in a database table or JSON file.
6. Add `GET /me/avatar` that streams the current user's avatar only after authentication.

Then improve it by adding signature-based file type validation and cleanup when a user replaces an old avatar.

## Recap

File uploads combine parsing, validation, storage, authorization, and cleanup. Use generated storage names, strict size limits, type validation, and streaming where possible. Local disk is fine for learning, but production apps often use object storage plus database metadata. Never treat an uploaded file as safe just because the browser sent it.
