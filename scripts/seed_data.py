"""Seed the database with demo users and tasks."""
import os
import sys
import random
from datetime import datetime, timedelta, timezone

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.task import Task, TaskStatus, TaskPriority

DEMO_USERS = [
    {"email": "demo@taskflow.app", "username": "Demo User", "password": "Demo@1234"},
    {"email": "admin@taskflow.app", "username": "Admin User", "password": "Admin@1234"},
]

TASK_TITLES = [
    "Set up CI/CD pipeline",
    "Design landing page mockup",
    "Write API documentation",
    "Fix authentication bug",
    "Review pull request #42",
    "Implement dark mode toggle",
    "Add Redis caching layer",
    "Write unit tests for auth module",
    "Set up Docker Compose",
    "Configure Nginx reverse proxy",
    "Implement WebSocket notifications",
    "Create database migration scripts",
    "Add rate limiting middleware",
    "Design Kanban board component",
    "Implement drag-and-drop sorting",
    "Add password strength meter",
    "Set up error monitoring (Sentry)",
    "Write Playwright E2E tests",
    "Optimize database queries",
    "Add pagination to task list",
]


def seed():
    config = os.environ.get("FLASK_CONFIG", "development")
    app = create_app(config)

    with app.app_context():
        db.create_all()

        for user_data in DEMO_USERS:
            existing = User.query.filter_by(email=user_data["email"]).first()
            if existing:
                print(f"  User {user_data['email']} already exists, skipping")
                continue

            user = User(email=user_data["email"], username=user_data["username"])
            user.set_password(user_data["password"])
            db.session.add(user)
            db.session.commit()
            print(f"  Created user: {user_data['email']}")

            # Create 15-20 tasks per user
            num_tasks = random.randint(15, 20)
            titles = random.sample(TASK_TITLES, min(num_tasks, len(TASK_TITLES)))

            statuses = (
                [TaskStatus.TODO] * 6
                + [TaskStatus.IN_PROGRESS] * 8
                + [TaskStatus.DONE] * 6
            )
            priorities = list(TaskPriority)

            for i, title in enumerate(titles):
                status = random.choice(statuses)
                priority = random.choice(priorities)

                # Random due dates: some past, some today, some future
                offset = random.randint(-5, 14)
                due_date = datetime.now(timezone.utc) + timedelta(days=offset)

                task = Task(
                    title=title,
                    description=f"Auto-generated task for demo: {title}",
                    status=status,
                    priority=priority,
                    due_date=due_date,
                    position=i,
                    user_id=user.id,
                )
                db.session.add(task)

            db.session.commit()
            print(f"  Created {num_tasks} tasks for {user_data['email']}")

        print("Seed complete!")


if __name__ == "__main__":
    seed()
