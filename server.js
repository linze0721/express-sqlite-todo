'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const Database = require('better-sqlite3');

function rowToJson(row) {
  return {
    id: row.id,
    title: row.title,
    done: Boolean(row.done),
    created_at: row.created_at,
  };
}

const dbFile = path.join(process.env.DATA_DIR || '/data', 'app.db');
fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const db = new Database(dbFile);
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

const app = express();
app.use(express.json());

app.get('/api/todos', (_req, res) => {
  const rows = db
    .prepare('SELECT id, title, done, created_at FROM todos ORDER BY created_at DESC')
    .all();
  res.json(rows.map(rowToJson));
});

app.post('/api/todos', (req, res) => {
  const title = typeof req.body?.title === 'string' ? req.body.title.trim() : '';
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const created_at = new Date().toISOString();
  const info = db
    .prepare('INSERT INTO todos (title, done, created_at) VALUES (?, 0, ?)')
    .run(title, created_at);
  const row = db
    .prepare('SELECT id, title, done, created_at FROM todos WHERE id = ?')
    .get(info.lastInsertRowid);
  res.status(201).json(rowToJson(row));
});

app.patch('/api/todos/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const existing = db.prepare('SELECT id FROM todos WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  if (typeof req.body?.done !== 'boolean') {
    return res.status(400).json({ error: 'done must be a boolean' });
  }
  db.prepare('UPDATE todos SET done = ? WHERE id = ?').run(req.body.done ? 1 : 0, id);
  const row = db
    .prepare('SELECT id, title, done, created_at FROM todos WHERE id = ?')
    .get(id);
  res.json(rowToJson(row));
});

app.delete('/api/todos/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const info = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
});

app.use(express.static(path.join(__dirname, 'public')));

const port = Number.parseInt(process.env.PORT || '8080', 10);
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});