# Backend (Express + SQLite)

## Quick start
1. `cd server && npm install`
2. `npm run dev` (defaults to http://localhost:4000)

## API overview
- `GET /api/dashboard?date=YYYY-MM-DD` — tasks, habits (with completion), currentScore.
- `POST /api/tasks` — body `{ title, type, addToCommon?, date? }`.
- `POST /api/tasks/common` — body `{ titles: string[], date? }`.
- `GET /api/tasks/common` — list common task titles.
- `DELETE /api/tasks/:id` — remove a task.
- `DELETE /api/tasks/common/:title` — remove a common task by title.
- `POST /api/tasks/:id/complete` — body `{ stars }`.
- `GET /api/habits?date=YYYY-MM-DD` — habits with daily state.
- `POST /api/habits` — body `{ name, iconKey }`; `DELETE /api/habits/:id`.
- `POST /api/habits/:id/toggle` — body `{ completed, date? }`.
- `POST /api/redeem` — body `{ reason, points }` (fails if insufficient points).

## Notes
- SQLite file `app.db` created in `server/` with seed data for today’s tasks/habits/common tasks.
- Points = task stars ×10 + completed habits ×5 − redeemed points.
- CORS is enabled; frontends can set `VITE_API_BASE=http://localhost:4000` to point to this API.
