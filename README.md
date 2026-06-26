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
| `DATA_DIR` | `/data` | Directory for the SQLite database file (`app.db`) |

Example:

```bash
PORT=8080 DATA_DIR=/data pnpm start
```

`DATA_DIR` is created automatically if missing. In containers, use a writable volume mount at `/data` (or set `DATA_DIR` accordingly).

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
# SQLite lives at $DATA_DIR/app.db (default /data/app.db)
design/            # UI mockups
```