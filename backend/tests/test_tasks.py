import pytest
from datetime import datetime, timezone, timedelta


class TestCreateTask:
    """Tests for POST /api/tasks."""

    def test_create_task_success(self, auth_cookies):
        response = auth_cookies.post(
            "/api/tasks",
            json={"title": "My first task", "priority": "high"},
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["task"]["title"] == "My first task"
        assert data["task"]["priority"] == "high"
        assert data["task"]["status"] == "todo"

    def test_create_task_all_fields(self, auth_cookies):
        future = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        response = auth_cookies.post(
            "/api/tasks",
            json={
                "title": "Full task",
                "description": "A detailed description",
                "status": "in_progress",
                "priority": "urgent",
                "due_date": future,
                "position": 5,
            },
        )
        assert response.status_code == 201
        task = response.get_json()["task"]
        assert task["description"] == "A detailed description"
        assert task["status"] == "in_progress"
        assert task["priority"] == "urgent"
        assert task["position"] == 5

    def test_create_task_missing_title(self, auth_cookies):
        response = auth_cookies.post("/api/tasks", json={"priority": "low"})
        assert response.status_code == 422

    def test_create_task_title_too_long(self, auth_cookies):
        response = auth_cookies.post(
            "/api/tasks", json={"title": "x" * 201}
        )
        assert response.status_code == 422

    def test_create_task_invalid_status(self, auth_cookies):
        response = auth_cookies.post(
            "/api/tasks", json={"title": "Test", "status": "invalid"}
        )
        assert response.status_code == 422

    def test_create_task_no_body(self, auth_cookies):
        response = auth_cookies.post(
            "/api/tasks", content_type="application/json"
        )
        assert response.status_code == 400

    def test_create_task_unauthenticated(self, client):
        response = client.post("/api/tasks", json={"title": "Test"})
        assert response.status_code == 401


class TestGetTasks:
    """Tests for GET /api/tasks."""

    def test_list_tasks_empty(self, auth_cookies):
        response = auth_cookies.get("/api/tasks")
        assert response.status_code == 200
        data = response.get_json()
        assert data["tasks"] == []
        assert data["pagination"]["total"] == 0

    def test_list_tasks_with_data(self, auth_cookies):
        auth_cookies.post("/api/tasks", json={"title": "Task 1"})
        auth_cookies.post("/api/tasks", json={"title": "Task 2"})
        response = auth_cookies.get("/api/tasks")
        assert response.status_code == 200
        assert len(response.get_json()["tasks"]) == 2

    def test_filter_by_status(self, auth_cookies):
        auth_cookies.post("/api/tasks", json={"title": "Todo", "status": "todo"})
        auth_cookies.post("/api/tasks", json={"title": "Done", "status": "done"})
        response = auth_cookies.get("/api/tasks?status=todo")
        tasks = response.get_json()["tasks"]
        assert len(tasks) == 1
        assert tasks[0]["status"] == "todo"

    def test_filter_by_priority(self, auth_cookies):
        auth_cookies.post("/api/tasks", json={"title": "High", "priority": "high"})
        auth_cookies.post("/api/tasks", json={"title": "Low", "priority": "low"})
        response = auth_cookies.get("/api/tasks?priority=high")
        tasks = response.get_json()["tasks"]
        assert len(tasks) == 1
        assert tasks[0]["priority"] == "high"

    def test_search_by_title(self, auth_cookies):
        auth_cookies.post("/api/tasks", json={"title": "Deploy to production"})
        auth_cookies.post("/api/tasks", json={"title": "Write tests"})
        response = auth_cookies.get("/api/tasks?search=deploy")
        tasks = response.get_json()["tasks"]
        assert len(tasks) == 1
        assert "Deploy" in tasks[0]["title"]

    def test_pagination(self, auth_cookies):
        for i in range(5):
            auth_cookies.post("/api/tasks", json={"title": f"Task {i}"})
        response = auth_cookies.get("/api/tasks?page=1&per_page=2")
        data = response.get_json()
        assert len(data["tasks"]) == 2
        assert data["pagination"]["total"] == 5
        assert data["pagination"]["pages"] == 3
        assert data["pagination"]["has_next"] is True

    def test_sort_ascending(self, auth_cookies):
        auth_cookies.post("/api/tasks", json={"title": "B task"})
        auth_cookies.post("/api/tasks", json={"title": "A task"})
        response = auth_cookies.get("/api/tasks?sort_by=title&order=asc")
        tasks = response.get_json()["tasks"]
        assert tasks[0]["title"] == "A task"

    def test_unauthenticated(self, client):
        response = client.get("/api/tasks")
        assert response.status_code == 401


class TestGetSingleTask:
    """Tests for GET /api/tasks/:id."""

    def test_get_task_success(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "Test"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.get(f"/api/tasks/{task_id}")
        assert response.status_code == 200
        assert response.get_json()["task"]["title"] == "Test"

    def test_get_task_not_found(self, auth_cookies):
        response = auth_cookies.get("/api/tasks/nonexistent-id")
        assert response.status_code == 404

    def test_get_other_users_task(self, client, auth_cookies, db_session):
        """User cannot access another user's task."""
        from app.models.user import User
        from app.models.task import Task

        other = User(email="other@example.com", username="other")
        other.set_password("Test@1234")
        db_session.add(other)
        db_session.flush()
        task = Task(title="Secret", user_id=other.id)
        db_session.add(task)
        db_session.flush()

        response = auth_cookies.get(f"/api/tasks/{task.id}")
        assert response.status_code == 404


class TestUpdateTask:
    """Tests for PUT /api/tasks/:id."""

    def test_full_update_success(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "Original"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.put(
            f"/api/tasks/{task_id}",
            json={"title": "Updated", "status": "done", "priority": "high"},
        )
        assert response.status_code == 200
        assert response.get_json()["task"]["title"] == "Updated"

    def test_full_update_not_found(self, auth_cookies):
        response = auth_cookies.put(
            "/api/tasks/fake-id", json={"title": "Nope"}
        )
        assert response.status_code == 404

    def test_full_update_no_body(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "T"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.put(
            f"/api/tasks/{task_id}", content_type="application/json"
        )
        assert response.status_code == 400

    def test_full_update_validation_error(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "T"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.put(
            f"/api/tasks/{task_id}", json={"title": "", "status": "invalid"}
        )
        assert response.status_code == 422


class TestPatchTask:
    """Tests for PATCH /api/tasks/:id."""

    def test_patch_status(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "Test"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.patch(
            f"/api/tasks/{task_id}", json={"status": "done"}
        )
        assert response.status_code == 200
        assert response.get_json()["task"]["status"] == "done"

    def test_patch_position(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "Test"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.patch(
            f"/api/tasks/{task_id}", json={"position": 3}
        )
        assert response.status_code == 200
        assert response.get_json()["task"]["position"] == 3

    def test_patch_not_found(self, auth_cookies):
        response = auth_cookies.patch(
            "/api/tasks/fake-id", json={"status": "done"}
        )
        assert response.status_code == 404

    def test_patch_no_body(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "T"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.patch(
            f"/api/tasks/{task_id}", content_type="application/json"
        )
        assert response.status_code == 400


class TestDeleteTask:
    """Tests for DELETE /api/tasks/:id."""

    def test_delete_success(self, auth_cookies):
        create_resp = auth_cookies.post("/api/tasks", json={"title": "Delete me"})
        task_id = create_resp.get_json()["task"]["id"]
        response = auth_cookies.delete(f"/api/tasks/{task_id}")
        assert response.status_code == 200
        # Verify it's gone
        get_resp = auth_cookies.get(f"/api/tasks/{task_id}")
        assert get_resp.status_code == 404

    def test_delete_not_found(self, auth_cookies):
        response = auth_cookies.delete("/api/tasks/fake-id")
        assert response.status_code == 404

    def test_delete_unauthenticated(self, client):
        response = client.delete("/api/tasks/some-id")
        assert response.status_code == 401
