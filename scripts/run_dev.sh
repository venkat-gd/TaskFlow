#!/bin/bash
# Start all services for local development
set -e

echo "Starting TaskFlow development environment..."

# Start backend
echo "Starting backend..."
cd "$(dirname "$0")/../backend"
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt -q

export FLASK_CONFIG=development
export FLASK_APP=wsgi.py

# Run migrations
flask db upgrade 2>/dev/null || echo "No pending migrations"

# Seed data
python ../scripts/seed_data.py

# Start backend server in background
flask run --debug &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend..."
cd ../frontend
npm install -q
npm run dev &
FRONTEND_PID=$!

echo ""
echo "TaskFlow is running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  Demo login: demo@taskflow.app / Demo@1234"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
