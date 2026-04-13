# TaskFlow — Project Conventions

## Python / Backend
- Formatter: Black, 88 char line width
- Type hints on all function signatures
- Use Python logging module — no print() in committed code
- Flask app factory pattern in `backend/app/__init__.py`
- Test config uses SQLite in-memory + fakeredis + celery always_eager

## TypeScript / Frontend
- Strict mode, no `any`
- Prefer interfaces over types for object shapes
- Every component max 150 lines; extract hooks if logic > 30 lines
- No console.log in committed code

## Git
- Conventional commits: feat:, fix:, test:, docs:, ci:
- Branch: feature branches off develop, PRs to develop, develop -> main for releases

## Testing
- Write tests alongside implementation (red-green-refactor)
- Every API endpoint must have test coverage
- Backend target: 90%+ coverage with pytest-cov

## Running
- Backend: `cd backend && make run`
- Tests: `cd backend && make test`
- Full stack: `docker-compose up`
