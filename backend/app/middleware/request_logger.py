import logging
import time
from datetime import datetime, timezone

from flask import Flask, g, request

logger = logging.getLogger(__name__)


def register_request_logger(app: Flask) -> None:
    """Middleware that logs request/response timing and emits to WebSocket."""

    @app.before_request
    def start_timer():
        g.start_time = time.time()

    @app.after_request
    def log_request(response):
        if not hasattr(g, "start_time"):
            return response

        duration_ms = round((time.time() - g.start_time) * 1000, 2)
        user_id = None

        try:
            from flask_jwt_extended import get_jwt_identity

            user_id = get_jwt_identity()
        except Exception:
            pass

        log_entry = {
            "method": request.method,
            "path": request.path,
            "status": response.status_code,
            "duration_ms": duration_ms,
            "user_id": user_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "cache_hit": getattr(g, "cache_hit", None),
        }

        logger.info(
            "%s %s %s %.2fms",
            request.method,
            request.path,
            response.status_code,
            duration_ms,
        )

        # Emit to WebSocket for devtools panel
        try:
            from app.extensions import socketio

            if user_id:
                socketio.emit("api_log", log_entry, room=user_id)
        except Exception:
            pass

        return response
