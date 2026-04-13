import logging
import time

from app.celery_app import celery

logger = logging.getLogger(__name__)


@celery.task(name="send_welcome_email")
def send_welcome_email(user_id: str, email: str) -> dict:
    """Send welcome email (mock for demo — logs and sleeps)."""
    logger.info("Would send welcome email to %s (user_id=%s)", email, user_id)
    time.sleep(2)
    return {"status": "sent", "email": email}


@celery.task(name="send_task_notification")
def send_task_notification(task_id: str, action: str) -> dict:
    """Send task notification (mock for demo)."""
    logger.info("Would send notification: task %s was %s", task_id, action)
    time.sleep(1)
    return {"status": "sent", "task_id": task_id, "action": action}
