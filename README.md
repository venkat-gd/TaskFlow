# TaskFlow — Full-Stack Architecture Showcase

A production-grade task management application that doubles as a live architecture showcase. It features a **"Behind the Scenes" panel** that shows real-time API logs, cache hit/miss indicators, Celery task queue status, and DB query counts — letting visitors SEE the architecture working.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Zustand, Framer Motion |
| Backend | Flask, SQLAlchemy, Flask-JWT-Extended, Marshmallow |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Task Queue | Celery with Redis broker |
| Real-time | Flask-SocketIO + socket.io-client |
| Testing | pytest (90%+ coverage), Playwright E2E |
| DevOps | Docker Compose, GitHub Actions CI/CD |

## Quick Start

### With Docker (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Demo login: `demo@taskflow.app` / `Demo@1234`

### Local Development

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
export FLASK_CONFIG=development
flask db upgrade
python ../scripts/seed_data.py
flask run --debug

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Or use the dev script:
```bash
./scripts/run_dev.sh
```

## Project Structure

```
taskflow/
├── frontend/               # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/     # ui/, layout/, auth/, tasks/, dashboard/, landing/, devtools/
│   │   ├── hooks/          # useAuth, useTasks, useTheme, useWebSocket, useDevTools
│   │   ├── services/       # api.ts, auth.ts, tasks.ts, websocket.ts
│   │   ├── store/          # Zustand: authStore, taskStore, uiStore, devToolsStore
│   │   ├── types/          # TypeScript interfaces
│   │   └── pages/          # Landing, Login, Register, Dashboard, Tasks
│   └── e2e/                # Playwright tests
├── backend/                # Flask + SQLAlchemy + JWT + Redis + Celery
│   ├── app/
│   │   ├── models/         # User, Task (UUID PKs, enums, relationships)
│   │   ├── api/            # auth, tasks, users, health blueprints
│   │   ├── services/       # auth_service, task_service, cache_service
│   │   ├── middleware/     # error_handler, request_logger, rate_limiter
│   │   ├── schemas/        # Marshmallow validation
│   │   └── tasks/          # Celery: email_tasks, cleanup_tasks
│   ├── tests/              # pytest with 90%+ coverage
│   └── migrations/         # Alembic
├── docker-compose.yml      # Full stack: Flask + PG + Redis + Celery + Frontend
├── .github/workflows/      # CI/CD: lint → test → security → build → deploy
└── scripts/                # seed_data.py, run_dev.sh
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register with email, username, password |
| POST | `/api/auth/login` | Login, sets httpOnly JWT cookies |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke tokens via Redis blocklist |
| GET | `/api/tasks` | List tasks (filter, sort, paginate, cached) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get single task |
| PUT | `/api/tasks/:id` | Full update |
| PATCH | `/api/tasks/:id` | Partial update (status, position) |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/users/me` | Current user profile |
| PATCH | `/api/users/me` | Update profile |
| GET | `/api/health` | Service health check |

## Testing

```bash
# Backend tests (65 tests, 93%+ coverage)
cd backend
pytest tests/ -v --cov=app --cov-report=term-missing

# Frontend E2E
cd frontend
npx playwright test
```

## Architecture Highlights

- **JWT Auth via httpOnly Cookies** — secure token storage, CSRF protection, automatic refresh
- **Redis Caching** — task list caching with query-hash keys, automatic invalidation on writes, hit/miss stats
- **Rate Limiting** — sliding window counter per user (100/min) or IP (20/min)
- **Celery Background Tasks** — async email notifications, periodic token cleanup
- **Behind the Scenes Panel** — real-time visibility into API calls, cache performance, task queue, DB queries via WebSocket
- **Optimistic UI** — instant updates with automatic rollback on API failure
- **Kanban Drag-and-Drop** — @dnd-kit for smooth column-to-column status changes

## Demo Accounts

| Email | Password |
|-------|----------|
| demo@taskflow.app | Demo@1234 |
| admin@taskflow.app | Admin@1234 |
