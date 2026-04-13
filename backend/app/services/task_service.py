from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import asc, desc

from app.extensions import db
from app.models.task import Task, TaskPriority, TaskStatus
from app.services.cache_service import (
    _make_key,
    get_cached,
    invalidate_user_tasks,
    set_cached,
)

PRIORITY_ORDER = {
    TaskPriority.LOW: 0,
    TaskPriority.MEDIUM: 1,
    TaskPriority.HIGH: 2,
    TaskPriority.URGENT: 3,
}


def list_tasks(user_id: str, params: dict) -> dict:
    """List tasks with filtering, sorting, pagination, and caching."""
    cache_key = _make_key("tasks", user_id, params)
    cached = get_cached(cache_key)
    if cached is not None:
        return cached

    query = Task.query.filter_by(user_id=user_id)

    # Filters
    if params.get("status"):
        query = query.filter(Task.status == TaskStatus(params["status"]))
    if params.get("priority"):
        query = query.filter(Task.priority == TaskPriority(params["priority"]))
    if params.get("search"):
        query = query.filter(Task.title.ilike(f"%{params['search']}%"))

    # Sorting
    sort_by = params.get("sort_by", "created_at")
    order = params.get("order", "desc")
    sort_column = getattr(Task, sort_by, Task.created_at)
    query = query.order_by(desc(sort_column) if order == "desc" else asc(sort_column))

    # Pagination
    page = int(params.get("page", 1))
    per_page = min(int(params.get("per_page", 20)), 100)
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    result = {
        "tasks": [t.to_dict() for t in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_prev": pagination.has_prev,
        },
    }

    set_cached(cache_key, result)
    return result


def get_task(task_id: str, user_id: str) -> Task | None:
    """Get a single task, ensuring it belongs to the user."""
    return Task.query.filter_by(id=task_id, user_id=user_id).first()


def create_task(user_id: str, data: dict) -> Task:
    """Create a new task for the user."""
    task = Task(
        title=data["title"],
        description=data.get("description"),
        status=TaskStatus(data.get("status", "todo")),
        priority=TaskPriority(data.get("priority", "medium")),
        due_date=data.get("due_date"),
        position=data.get("position", 0),
        user_id=user_id,
    )
    db.session.add(task)
    db.session.commit()
    invalidate_user_tasks(user_id)
    return task


def update_task(task: Task, data: dict) -> Task:
    """Full update of a task."""
    task.title = data["title"]
    task.description = data.get("description")
    task.status = TaskStatus(data.get("status", task.status.value))
    task.priority = TaskPriority(data.get("priority", task.priority.value))
    task.due_date = data.get("due_date", task.due_date)
    task.position = data.get("position", task.position)
    task.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    invalidate_user_tasks(task.user_id)
    return task


def patch_task(task: Task, data: dict) -> Task:
    """Partial update of a task."""
    for field in ("title", "description", "position"):
        if field in data:
            setattr(task, field, data[field])
    if "status" in data:
        task.status = TaskStatus(data["status"])
    if "priority" in data:
        task.priority = TaskPriority(data["priority"])
    if "due_date" in data:
        task.due_date = data["due_date"]
    task.updated_at = datetime.now(timezone.utc)
    db.session.commit()
    invalidate_user_tasks(task.user_id)
    return task


def delete_task(task: Task) -> None:
    """Hard delete a task."""
    user_id = task.user_id
    db.session.delete(task)
    db.session.commit()
    invalidate_user_tasks(user_id)
