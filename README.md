# AIVA — Chatbot & Personal AI Assistant

A full-stack app: React + Vite frontend, Express backend, PostgreSQL database
(via Drizzle ORM). All pages that look "smart" (chatbot, task list, memory
bank, fake-news detector, dashboard stats) are backed by real API routes and
persisted to the database.

## Stack

- **Frontend:** React 19, Vite, Tailwind, TanStack Query, wouter
- **Backend:** Express, TypeScript (`tsx`)
- **Database:** PostgreSQL via Drizzle ORM (with an automatic in-memory
  fallback for zero-config local development)

## Getting started

```bash
npm install
cp .env.example .env
```

### Option A — run without a database (fastest way to try it out)

Just leave `DATABASE_URL` empty in `.env` (or unset) and run:

```bash
npm run dev
```

The server logs `Using in-memory storage` and the app is fully usable —
chat, tasks, memories, and fake-news checks all work. Data resets whenever
you restart the server.

### Option B — run with a real PostgreSQL database (persistent data)

1. Provision a Postgres database (local Postgres, [Neon](https://neon.tech),
   Supabase, Railway, etc.) and copy its connection string.
2. Put it in `.env`:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   ```
3. Push the schema to your database:
   ```bash
   npm run db:push
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
   The server logs `Using PostgreSQL database` and every chat message, task,
   memory, and fake-news analysis is now persisted.

App runs at **http://localhost:5000** (frontend and API share the same
port — Vite is mounted as middleware in development).

## Production build

```bash
npm run build
npm start
```

## Project structure

```
client/           React frontend (Vite)
server/
  index.ts        Express app entrypoint
  routes.ts        REST API route definitions
  storage.ts       IStorage interface + DbStorage (Postgres) / MemStorage (in-memory)
  db.ts            Drizzle + pg connection setup
shared/
  schema.ts        Drizzle table definitions + Zod schemas (shared by client & server)
  chatbot.ts        Chatbot / assistant reply logic + fake-news heuristic analyzer
```

## Database schema

| Table            | Purpose                                                        |
|-------------------|-----------------------------------------------------------------|
| `users`           | Basic user account scaffold (username/password)                 |
| `chat_messages`   | All chat history, split by `channel` (`chat` = portfolio bot, `assistant` = Nexus AI) |
| `tasks`           | Nexus AI assistant task list                                    |
| `memories`        | Nexus AI "Memory Bank" notes                                    |
| `news_analyses`   | History of fake-news detector submissions and results           |

## API reference

| Method | Route                     | Description                                      |
|--------|---------------------------|---------------------------------------------------|
| GET    | `/api/health`             | Health check                                       |
| GET    | `/api/messages?channel=`  | Get chat history (`chat` or `assistant`)           |
| POST   | `/api/messages`           | Send a message `{ content, channel }`, get bot reply |
| DELETE | `/api/messages?channel=`  | Clear chat history for a channel                   |
| GET    | `/api/tasks`               | List tasks                                          |
| POST   | `/api/tasks`               | Create a task `{ title, dueLabel?, priority? }`     |
| PATCH  | `/api/tasks/:id`           | Update a task (e.g. `{ completed: true }`)          |
| DELETE | `/api/tasks/:id`           | Delete a task                                       |
| GET    | `/api/memories`            | List memory bank entries                            |
| POST   | `/api/memories`            | Add a memory `{ content }`                          |
| DELETE | `/api/memories/:id`        | Delete a memory                                     |
| POST   | `/api/news/analyze`        | Analyze text `{ text }`, returns score/label/reasons and persists it |
| GET    | `/api/news/history`        | Recent fake-news analyses                           |
| GET    | `/api/dashboard/stats`     | Aggregate counts for the dashboard                  |

## Notes on the fake-news detector

The analyzer is a lightweight, explainable **heuristic** (checks for ALL-CAPS
shouting, excessive punctuation, sensational phrases, content length, dates,
and source links) — not a trained ML model. It's deterministic and fast, and
every result (with its reasoning) is saved to the `news_analyses` table.
