from __future__ import annotations

import os
from typing import Any

from celery import Celery


def make_celery(app=None) -> Celery:
    """Create a Celery instance configured from Flask app."""
    celery = Celery(__name__)

    if app is not None:
        celery.conf.update(
            broker_url=app.config.get("CELERY_BROKER_URL", "redis://localhost:6379/1"),
            result_backend=app.config.get(
                "CELERY_RESULT_BACKEND", "redis://localhost:6379/1"
            ),
            task_always_eager=app.config.get("CELERY_ALWAYS_EAGER", False),
            task_eager_propagates=True,
        )

        class ContextTask(celery.Task):  # type: ignore[name-defined]
            def __call__(self, *args: Any, **kwargs: Any) -> Any:
                with app.app_context():
                    return self.run(*args, **kwargs)

        celery.Task = ContextTask  # type: ignore[assignment]
    else:
        # Standalone mode (docker-compose worker/beat): read from env
        celery.conf.update(
            broker_url=os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/1"),
            result_backend=os.environ.get(
                "CELERY_RESULT_BACKEND", "redis://localhost:6379/1"
            ),
        )

    celery.autodiscover_tasks(["app.tasks"])

    return celery


celery = make_celery()
