# SQLite and Node.js

## Why It Matters

SQLite is an embedded relational database stored in a file. It is excellent for local development, tests, prototypes, desktop apps, small services, and read-heavy workloads where running a separate database server would be unnecessary.

## Core Concepts

- SQLite runs in-process through a driver; there is no separate server to connect to.
- It supports SQL, indexes, transactions, constraints, and foreign keys.
- Writes are serialized, so heavy concurrent writes need careful design.
- The database file must be backed up and deployed like application data.
- Use parameterized queries to avoid SQL injection.

## Flow to Remember

Node calls the SQLite driver, the driver reads or writes the database file, SQL constraints enforce data rules, and the result returns to your service.

## Syntax and Examples

```js
import Database from 'better-sqlite3';

const db = new Database('app.db');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const insert = db.prepare('INSERT INTO notes (title, body) VALUES (?, ?)');
const result = insert.run('SQLite with Node', 'Use parameters for values.');

const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
console.log(note);
```

## Use Cases and Tradeoffs

- Use SQLite for local-first tools, test databases, queues for small apps, and simple deployments.
- Use WAL mode for better read/write concurrency.
- Use migrations even for SQLite so schema changes are repeatable.
- Move to PostgreSQL or MySQL when many app instances need shared concurrent writes.

## Common Mistakes

- Building SQL strings with user input.
- Forgetting to enable foreign keys.
- Treating the database file as disposable in production.
- Assuming SQLite write concurrency behaves like a client-server database.

## Practical Challenge

Create a SQLite-backed notes repository with `createNote`, `findNoteById`, and `listNotes`. Add a unique index on title and handle duplicate titles gracefully.

## Recap

- SQLite is a real relational database in a file.
- It is great for small and local workloads.
- Parameterization, constraints, backups, and migrations still matter.

