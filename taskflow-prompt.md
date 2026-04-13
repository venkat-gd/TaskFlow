# Claude Code Prompt — TaskFlow: Full-Stack Architecture Showcase

## What to Build

Build "TaskFlow" — a full-stack task management app that doubles as a live architecture showcase. It has two faces:

1. **Product landing page** — marketing page showcasing the architecture with interactive diagrams, tech stack badges, and a "Try the Live Demo" CTA
2. **Functional app** — real task management with auth, CRUD, real-time updates, caching, background jobs — proving the architecture actually works

The killer feature: a **"Behind the Scenes" panel** (toggleable drawer on the right side of the app) that shows live API request/response logs, Redis cache hit/miss indicators, Celery task queue status, and DB query counts. This is what makes it a portfolio piece — visitors can SEE the architecture working, not just read about it.

---

## Project Structure

```
taskflow/
├── frontend/                    # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI primitives (Button, Input, Card, Badge, Modal, Toast)
│   │   │   ├── layout/          # AppShell, Sidebar, Header, ThemeToggle
│   │   │   ├── auth/            # LoginForm, RegisterForm, ProtectedRoute
│   │   │   ├── tasks/           # TaskList, TaskCard, TaskForm, TaskFilters, KanbanBoard
│   │   │   ├── dashboard/       # StatsCards, ActivityFeed, Charts
│   │   │   ├── landing/         # HeroSection, ArchitectureDiagram, TechStack, FeatureCards, CTASection
│   │   │   └── devtools/        # BehindTheScenes panel — ApiLogger, CacheMonitor, TaskQueueViewer, DbQueryLog
│   │   ├── hooks/               # useAuth, useTasks, useTheme, useWebSocket, useDevTools
│   │   ├── services/            # api.ts (axios instance with interceptors), auth.ts, tasks.ts, websocket.ts
│   │   ├── store/               # Zustand stores — authStore, taskStore, uiStore, devToolsStore
│   │   ├── types/               # TypeScript interfaces for Task, User, ApiResponse, WebSocketEvent
│   │   ├── utils/               # formatDate, validators, classNames helper
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, DashboardPage, TasksPage
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── e2e/                     # Playwright tests
│   │   ├── auth.spec.ts
│   │   ├── tasks.spec.ts
│   │   ├── dashboard.spec.ts
│   │   └── responsive.spec.ts
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Flask + SQLAlchemy + JWT + Redis + Celery
│   ├── app/
│   │   ├── __init__.py          # create_app factory
│   │   ├── config.py            # Config classes (Dev, Test, Prod) from env vars
│   │   ├── extensions.py        # db, jwt, redis_client, celery, migrate, cors
│   │   ├── models/
│   │   │   ├── user.py          # User model with password hashing (bcrypt)
│   │   │   └── task.py          # Task model with status enum, priority, due_date, assigned_to
│   │   ├── api/
│   │   │   ├── __init__.py      # Blueprint registration
│   │   │   ├── auth.py          # POST /auth/register, /auth/login, /auth/refresh, /auth/logout
│   │   │   ├── tasks.py         # Full CRUD: GET/POST/PUT/PATCH/DELETE /tasks, with filtering, pagination, sorting
│   │   │   ├── users.py         # GET /users/me, PATCH /users/me
│   │   │   └── health.py        # GET /health (DB + Redis + Celery connectivity check)
│   │   ├── services/
│   │   │   ├── auth_service.py  # Token generation, password verification, refresh logic
│   │   │   ├── task_service.py  # Business logic layer between API and models
│   │   │   └── cache_service.py # Redis cache helpers with TTL, key patterns, invalidation
│   │   ├── tasks/               # Celery tasks
│   │   │   ├── __init__.py
│   │   │   ├── email_tasks.py   # send_welcome_email, send_task_notification (mock/log for demo)
│   │   │   └── cleanup_tasks.py # periodic cleanup of expired tokens, old completed tasks
│   │   ├── middleware/
│   │   │   ├── request_logger.py    # Logs every request/response with timing, emits to WebSocket
│   │   │   ├── rate_limiter.py      # Token bucket rate limiting per user
│   │   │   └── error_handler.py     # Global exception handlers returning consistent JSON errors
│   │   ├── schemas/             # Marshmallow or Pydantic-style validation schemas
│   │   │   ├── auth_schema.py
│   │   │   └── task_schema.py
│   │   └── utils/
│   │       ├── validators.py
│   │       └── helpers.py
│   ├── migrations/              # Flask-Migrate / Alembic
│   ├── tests/
│   │   ├── conftest.py          # Fixtures: app, client, db, auth_headers, sample_tasks
│   │   ├── test_auth.py         # Registration, login, token refresh, logout, invalid credentials
│   │   ├── test_tasks.py        # CRUD, filtering, pagination, authorization, validation errors
│   │   ├── test_cache.py        # Cache hit/miss, invalidation, TTL expiry
│   │   ├── test_celery.py       # Task dispatch, result checking
│   │   └── test_health.py
│   ├── requirements.txt
│   ├── wsgi.py
│   └── Makefile                 # make run, make test, make coverage, make lint
│
├── docker-compose.yml           # Flask app + PostgreSQL + Redis + Celery worker + Celery beat
├── docker-compose.test.yml      # Test environment with ephemeral DB
├── Dockerfile.backend
├── Dockerfile.frontend
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml            # Full pipeline: lint → test → security scan → build → deploy
│
├── scripts/
│   ├── seed_data.py             # Populate DB with demo tasks and users
│   └── run_dev.sh               # Start all services for local development
│
├── CLAUDE.md                    # Project conventions for Claude Code
└── README.md
```

---

## Technical Requirements

### Frontend (React + TypeScript + Tailwind)

**Landing Page (/):**
- Hero section with animated architecture diagram (use Framer Motion)
- Three module cards (Frontend, Backend, QA/DevOps) with expandable details
- Interactive tech stack section with hover tooltips
- Live metrics pulled from the real /health endpoint (uptime, response time)
- "Try Live Demo" button → redirects to /register
- Fully responsive: mobile-first, breakpoints at sm/md/lg/xl
- Dark mode with system preference detection + manual toggle, persisted to localStorage

**Auth Pages (/login, /register):**
- Client-side validation with real-time feedback (email format, password strength meter, confirm password match)
- JWT tokens stored in httpOnly cookies (set by backend) — NOT localStorage
- Auto-redirect if already authenticated
- Loading states, error toasts, success transitions

**Dashboard (/dashboard):**
- Stats cards: total tasks, completed today, overdue, completion rate
- Activity feed showing recent task changes (from WebSocket)
- Mini chart showing tasks completed over the last 7 days (use Recharts)
- Quick-add task inline form

**Tasks Page (/tasks):**
- Kanban board view (Todo / In Progress / Done columns) with drag-and-drop (use @dnd-kit/core)
- List view toggle as alternative
- Filters: status, priority, date range, search by title
- Inline editing for task title and status
- Pagination (cursor-based from API)
- Optimistic updates with rollback on API failure

**Behind the Scenes Panel (toggleable from any app page):**
- Slide-in drawer from the right (300px wide)
- Tabs: API Log | Cache | Queue | DB
- API Log: real-time feed of requests — method, path, status code, latency (color-coded: green <100ms, amber <300ms, red >300ms)
- Cache: hit/miss ratio donut chart, recent cache operations list
- Queue: active Celery tasks with status (pending/running/completed/failed)
- DB: query count per request, slow query alerts
- Data comes via WebSocket from the backend middleware
- Toggle button in the header: "Show Architecture" with a circuit board icon

**Component Architecture Rules:**
- Every component gets its own file, max 150 lines
- Props interfaces defined in the component file or types/ directory
- Custom hooks for all data fetching and state logic — components are purely presentational
- Use Zustand for global state (auth, tasks, UI preferences, devtools data)
- Axios instance in services/api.ts with request/response interceptors for: attaching JWT, refreshing expired tokens automatically, logging to devtools store, global error handling

**Tailwind Configuration:**
- Extend with custom color palette (use a blue-indigo primary, semantic colors for status)
- Custom animation utilities for the landing page
- Dark mode via 'class' strategy
- Typography plugin for the landing page prose sections

### Backend (Flask + SQLAlchemy + JWT + Redis + Celery)

**Flask Application Factory (create_app):**
- Config from environment: DATABASE_URL, REDIS_URL, SECRET_KEY, JWT_SECRET_KEY
- Register blueprints: auth_bp, tasks_bp, users_bp, health_bp
- Initialize extensions: SQLAlchemy, Flask-JWT-Extended, Flask-Migrate, Flask-CORS, Flask-SocketIO
- Register error handlers and middleware
- CORS configured for frontend origin only

**Models:**
```python
# User: id (UUID), email (unique), username, password_hash, created_at, updated_at
# Task: id (UUID), title, description, status (enum: todo/in_progress/done),
#        priority (enum: low/medium/high/urgent), due_date, created_at, updated_at,
#        user_id (FK to User), position (integer, for kanban ordering)
```

**API Endpoints with full validation:**

Auth:
- POST /api/auth/register — validate email format, password min 8 chars with complexity, unique email check. Returns user + sets JWT cookies.
- POST /api/auth/login — verify credentials, return user + set httpOnly JWT cookies (access + refresh).
- POST /api/auth/refresh — use refresh token to issue new access token.
- POST /api/auth/logout — revoke tokens (add to Redis blocklist with TTL matching token expiry).

Tasks:
- GET /api/tasks — list user's tasks. Query params: status, priority, search (title ILIKE), sort_by (created_at/due_date/priority), order (asc/desc), page, per_page. Response includes pagination metadata. **Redis cached** with key pattern `tasks:{user_id}:{query_hash}`, TTL 60s.
- POST /api/tasks — create task. Validate title required and ≤200 chars, status must be valid enum, due_date must be future. **Invalidate user's task cache.** Dispatch Celery task for notification.
- GET /api/tasks/:id — get single task. Must belong to requesting user (403 otherwise).
- PUT /api/tasks/:id — full update. Same validation as create. Invalidate cache.
- PATCH /api/tasks/:id — partial update (for status changes, position reordering). Invalidate cache.
- DELETE /api/tasks/:id — soft delete or hard delete. Invalidate cache.

Health:
- GET /api/health — returns JSON with status of DB connection, Redis ping, Celery inspector. Used by the landing page and deployment health checks.

**Middleware:**
- Request logger: wraps every request, captures method, path, status, duration_ms, user_id. Emits event via Flask-SocketIO to connected "Behind the Scenes" panels. Also logs to Python logger.
- Rate limiter: 100 requests per minute per authenticated user, 20 per minute for unauthenticated. Uses Redis sliding window counter. Returns 429 with Retry-After header.
- Error handler: catches ValidationError, NotFound, Unauthorized, IntegrityError, generic Exception. Always returns `{"error": {"code": "...", "message": "...", "details": {...}}}`.

**Redis Caching (cache_service.py):**
- get_cached(key) / set_cached(key, data, ttl)
- Cache key pattern: `taskflow:{resource}:{user_id}:{hash}`
- Invalidation: on any write to tasks, delete all keys matching `taskflow:tasks:{user_id}:*`
- Track hit/miss stats in Redis: INCR `stats:cache:hits`, `stats:cache:misses`
- Expose cache stats via the WebSocket for the devtools panel

**Celery Tasks:**
- send_welcome_email(user_id) — triggered on registration. In demo mode, just logs "Would send welcome email to {email}" and sleeps 2 seconds to simulate.
- send_task_notification(task_id, action) — triggered on task create/update. Same mock behavior.
- cleanup_expired_tokens() — periodic beat task every hour. Scans Redis for expired token blocklist entries.
- All tasks report status to a Redis key `celery:task:{task_id}:status` that the devtools panel reads.

**Test Suite (pytest, target 90%+ coverage):**
- conftest.py: app fixture with test config (SQLite in-memory, fakeredis, celery always_eager), authenticated client fixture, sample user and tasks fixtures.
- test_auth.py: successful registration, duplicate email, weak password, login success, login wrong password, token refresh, logout + token blocklist.
- test_tasks.py: CRUD operations, filtering by status/priority, search, pagination, authorization (can't access other user's tasks), validation errors (missing title, invalid status, past due_date).
- test_cache.py: first request = cache miss, second = cache hit, write invalidates cache, TTL expiry.
- test_celery.py: task dispatched on registration, task dispatched on task creation, cleanup task runs.
- Use pytest-cov, target 90%+.

### WebSocket Integration

Use Flask-SocketIO on the backend and socket.io-client on the frontend.

Events emitted by backend (to authenticated user's room):
- `api_log` — {method, path, status, duration_ms, timestamp, cache_hit}
- `cache_event` — {operation: get/set/invalidate, key, hit: bool}
- `celery_event` — {task_id, name, status, started_at, completed_at}
- `task_update` — {task_id, action: created/updated/deleted, data}

Frontend devtools store listens to these and maintains a rolling buffer (last 50 events per category).

### Docker Compose

```yaml
services:
  backend:
    build: { dockerfile: Dockerfile.backend }
    ports: ["5000:5000"]
    env_file: .env
    depends_on: [db, redis]

  celery_worker:
    build: { dockerfile: Dockerfile.backend }
    command: celery -A app.extensions.celery worker --loglevel=info
    env_file: .env
    depends_on: [db, redis]

  celery_beat:
    build: { dockerfile: Dockerfile.backend }
    command: celery -A app.extensions.celery beat --loglevel=info
    env_file: .env
    depends_on: [redis]

  frontend:
    build: { dockerfile: Dockerfile.frontend }
    ports: ["3000:3000"]

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: taskflow_dev
    volumes: [pgdata:/var/lib/postgresql/data]
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

### CI/CD Pipeline (.github/workflows/ci-cd.yml)

```yaml
name: TaskFlow CI/CD

on:
  push: { branches: [main, develop] }
  pull_request: { branches: [main] }

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - Checkout
      - Frontend: npm ci → eslint + tsc --noEmit
      - Backend: pip install → flake8 + mypy + black --check

  test-backend:
    needs: lint
    runs-on: ubuntu-latest
    services:
      postgres: { image: postgres:16, env, ports: 5432:5432 }
      redis: { image: redis:7, ports: 6379:6379 }
    steps:
      - pip install -r requirements.txt
      - pytest --cov=app --cov-report=xml --cov-fail-under=90
      - Upload coverage to Codecov

  test-frontend:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - npm ci → npm run test (Vitest unit tests)
      - npx playwright install --with-deps
      - npm run test:e2e
      - Upload Playwright report artifact

  security:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - pip-audit (Python dependency vulnerabilities)
      - npm audit --audit-level=high
      - Trivy container scan on built images
      - OWASP ZAP baseline scan against running app

  build-and-deploy:
    needs: security
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - Build Docker images
      - Push to container registry
      - Deploy with blue-green strategy
      - Run health check against new deployment
      - Promote or rollback based on health
```

### Playwright E2E Tests

```typescript
// e2e/auth.spec.ts
- test: user can register with valid credentials → redirected to dashboard
- test: registration shows validation errors for weak password
- test: user can login → sees dashboard with stats
- test: invalid login shows error message
- test: logout clears session, redirects to landing

// e2e/tasks.spec.ts
- test: user can create a task from dashboard quick-add
- test: task appears in kanban board under correct column
- test: user can drag task between columns (status update)
- test: user can filter tasks by priority
- test: user can search tasks by title
- test: user can delete a task with confirmation

// e2e/dashboard.spec.ts
- test: dashboard shows correct task counts
- test: activity feed updates when tasks change

// e2e/responsive.spec.ts
- test: mobile viewport shows hamburger menu
- test: tablet viewport shows collapsed sidebar
- test: kanban columns stack vertically on mobile
```

---

## Design System

**Colors:**
- Primary: Indigo-600 (#4F46E5) / Indigo-500 for dark mode
- Secondary: Slate palette for neutrals
- Status: Emerald (success/done), Amber (warning/in-progress), Rose (error/urgent), Sky (info/todo)
- Behind-the-scenes panel: Slate-900 background (always dark, even in light mode) — like a terminal

**Typography:**
- Headings: Inter or system font, semibold
- Body: 14px base, relaxed line height
- Code/Logs in devtools: JetBrains Mono or monospace, 12px

**Landing Page Aesthetic:**
- Clean, modern, lots of whitespace
- Architecture diagram uses subtle animations (nodes pulse, connections draw themselves)
- Gradient hero text (indigo → purple)
- Glass-morphism cards for module highlights (subtle backdrop blur)

---

## Seed Data (scripts/seed_data.py)

Create 2 demo users:
- demo@taskflow.app / password: Demo@1234
- admin@taskflow.app / password: Admin@1234

Create 15-20 tasks per user with varied:
- Statuses (roughly 30% todo, 40% in_progress, 30% done)
- Priorities (mix of all four)
- Due dates (some past/overdue, some today, some future)
- Realistic titles: "Set up CI/CD pipeline", "Design landing page mockup", "Write API documentation", "Fix authentication bug", "Review pull request #42", etc.

---

## Implementation Order

1. Backend: models + migrations + auth endpoints + tests
2. Backend: task CRUD endpoints + caching + tests
3. Backend: Celery tasks + WebSocket events + middleware
4. Frontend: auth pages + API service + auth store
5. Frontend: dashboard + task pages + kanban board
6. Frontend: landing page
7. Frontend: Behind the Scenes devtools panel
8. Docker Compose setup
9. CI/CD pipeline configuration
10. Playwright E2E tests
11. Seed data script
12. README with setup instructions

---

## CLAUDE.md Conventions

- Python: Black formatter, 88 char line width, type hints on all function signatures
- TypeScript: strict mode, no any, prefer interfaces over types for object shapes
- Commits: conventional commits (feat:, fix:, test:, docs:, ci:)
- Branch: feature branches off develop, PRs to develop, develop → main for releases
- Tests: write tests alongside implementation, never after. Red-green-refactor.
- Every API endpoint must have corresponding test coverage
- Every React component must be under 150 lines. Extract hooks if logic exceeds 30 lines.
- No console.log in committed code — use proper logger (Python logging / custom useLogger hook)
