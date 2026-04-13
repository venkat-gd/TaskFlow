import time
import logging

from flask import Flask, jsonify, request

logger = logging.getLogger(__name__)


def register_rate_limiter(app: Flask) -> None:
    """Token bucket rate limiter using Redis sliding window."""

    @app.before_request
    def check_rate_limit():
        import app.extensions as ext

        rc = ext.redis_client
        if rc is None:
            return

        # Determine identity
        user_id = None
        try:
            from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

            verify_jwt_in_request(optional=True)
            user_id = get_jwt_identity()
        except Exception:
            pass

        if user_id:
            key = f"ratelimit:user:{user_id}"
            limit = 100
        else:
            key = f"ratelimit:ip:{request.remote_addr}"
            limit = 20

        window = 60  # seconds
        now = time.time()
        window_start = now - window

        pipe = rc.pipeline()
        pipe.zremrangebyscore(key, 0, window_start)
        pipe.zadd(key, {str(now): now})
        pipe.zcard(key)
        pipe.expire(key, window)
        results = pipe.execute()

        request_count = results[2]

        if request_count > limit:
            logger.warning("Rate limit exceeded for %s", key)
            response = jsonify(
                {
                    "error": {
                        "code": "RATE_LIMITED",
                        "message": "Too many requests.",
                        "details": {},
                    }
                }
            )
            response.status_code = 429
            response.headers["Retry-After"] = str(window)
            return response
