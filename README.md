# Todo with Backend Test

Simple todo list with Express 4, SQLite (`better-sqlite3`), and a vanilla HTML/JS UI. Design reference: `design/todo.html`.

## Requirements

- Node.js 20+
- [pnpm](https://pnpm.io/)

## Setup

```bash
pnpm install
pnpm rebuild better-sqlite3   # if native module was not built on install
```

## Run

```bash
pnpm start
```

Open [http://localhost:8080](http://localhost:8080) (or the port you set).

### Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP listen port (binds `0.0.0.0`) |
| `DATABASE_URL` | `sqlite:///data/app.db` | SQLite file path (`sqlite:///` prefix stripped) |

Example:

```bash
PORT=8080 DATABASE_URL=sqlite:///data/app.db pnpm start
```

The `data/` directory is created automatically. SQLite files under `data/` are gitignored.

## API

- `GET /api/todos` — list todos (newest first)
- `POST /api/todos` — `{ "title": "..." }`
- `PATCH /api/todos/:id` — `{ "done": true|false }`
- `DELETE /api/todos/:id`

## Project layout

```
package.json
server.js
public/index.html
data/              # SQLite (gitignored)
design/            # UI mockups
```