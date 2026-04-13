from datetime import timedelta

from flask import current_app
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
)

import app.extensions as ext
from app.extensions import db
from app.models.user import User


def register_user(email: str, username: str, password: str) -> User:
    """Create a new user with hashed password."""
    user = User(email=email, username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user


def authenticate_user(email: str, password: str) -> User | None:
    """Verify credentials and return the user or None."""
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return user
    return None


def generate_tokens(user_id: str) -> dict[str, str]:
    """Generate access and refresh JWT tokens."""
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return {"access_token": access_token, "refresh_token": refresh_token}


def revoke_token(jti: str, token_type: str = "access") -> None:
    """Add a token JTI to the Redis blocklist."""
    if token_type == "refresh":
        ttl = current_app.config["JWT_REFRESH_TOKEN_EXPIRES"]
    else:
        ttl = current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]

    if isinstance(ttl, timedelta):
        ttl_seconds = int(ttl.total_seconds())
    else:
        ttl_seconds = int(ttl)

    ext.redis_client.setex(f"blocklist:{jti}", ttl_seconds, "revoked")


def is_token_revoked(jwt_payload: dict) -> bool:
    """Check if a token's JTI is in the blocklist."""
    jti = jwt_payload["jti"]
    result = ext.redis_client.get(f"blocklist:{jti}")
    return result is not None
