from flask import Flask


def register_blueprints(app: Flask) -> None:
    """Register all API blueprints."""
    from app.api.auth import auth_bp
    from app.api.health import health_bp
    from app.api.tasks import tasks_bp
    from app.api.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(health_bp, url_prefix="/api")
