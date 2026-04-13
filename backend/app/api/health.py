from flask import Blueprint, jsonify

import app.extensions as ext
from app.extensions import db

health_bp = Blueprint("health", __name__)


@health_bp.route("/health", methods=["GET"])
def health_check():
    """Check connectivity to DB, Redis, and Celery."""
    status = {"status": "healthy", "services": {}}

    # Database check
    try:
        db.session.execute(db.text("SELECT 1"))
        status["services"]["database"] = "up"
    except Exception:
        status["services"]["database"] = "down"
        status["status"] = "degraded"

    # Redis check
    try:
        if ext.redis_client and ext.redis_client.ping():
            status["services"]["redis"] = "up"
        else:
            status["services"]["redis"] = "down"
            status["status"] = "degraded"
    except Exception:
        status["services"]["redis"] = "down"
        status["status"] = "degraded"

    # Celery check (basic — full check in later step)
    status["services"]["celery"] = "not_configured"

    http_status = 200 if status["status"] == "healthy" else 503
    return jsonify(status), http_status
