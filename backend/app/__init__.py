from flask import Flask

from app.config import config_by_name
from app.extensions import db, jwt, migrate, cors, socketio, init_redis


def create_app(config_name: str = "development") -> Flask:
    """Application factory for the TaskFlow backend."""
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, origins=app.config["CORS_ORIGINS"], supports_credentials=True)
    socketio.init_app(app, cors_allowed_origins=app.config["CORS_ORIGINS"])
    init_redis(app)

    # Register JWT token blocklist checker
    from app.services.auth_service import is_token_revoked

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(_jwt_header: dict, jwt_payload: dict) -> bool:
        return is_token_revoked(jwt_payload)

    # Initialize Celery
    from app.celery_app import celery, make_celery

    celery_instance = make_celery(app)
    celery.__dict__.update(celery_instance.__dict__)

    # Register error handlers
    from app.middleware.error_handler import register_error_handlers

    register_error_handlers(app)

    # Register middleware
    from app.middleware.request_logger import register_request_logger
    from app.middleware.rate_limiter import register_rate_limiter

    register_request_logger(app)
    if not app.config.get("TESTING"):
        register_rate_limiter(app)

    # Register blueprints
    from app.api import register_blueprints

    register_blueprints(app)

    return app
