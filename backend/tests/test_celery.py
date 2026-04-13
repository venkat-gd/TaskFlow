class TestCeleryTasks:
    """Tests for Celery task dispatch."""

    def test_welcome_email_task(self, app):
        with app.app_context():
            from app.tasks.email_tasks import send_welcome_email

            result = send_welcome_email("user-123", "test@example.com")
            assert result["status"] == "sent"
            assert result["email"] == "test@example.com"

    def test_task_notification(self, app):
        with app.app_context():
            from app.tasks.email_tasks import send_task_notification

            result = send_task_notification("task-456", "created")
            assert result["status"] == "sent"
            assert result["action"] == "created"

    def test_cleanup_expired_tokens(self, app):
        with app.app_context():
            from app.tasks.cleanup_tasks import cleanup_expired_tokens

            result = cleanup_expired_tokens()
            assert result["status"] == "done"
