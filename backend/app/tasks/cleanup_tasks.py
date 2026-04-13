import logging

from app.celery_app import celery

logger = logging.getLogger(__name__)


@celery.task(name="cleanup_expired_tokens")
def cleanup_expired_tokens() -> dict:
    """Periodic task: clean up expired token blocklist entries from Redis.

    Redis TTL handles expiry automatically, so this is mainly a logging/stats task.
    """
    import app.extensions as ext

    rc = ext.redis_client
    if rc is None:
        return {"status": "skipped", "reason": "no redis"}

    pattern = "blocklist:*"
    keys = rc.keys(pattern)
    expired_count = 0
    for key in keys:
        ttl = rc.ttl(key)
        if ttl == -2:  # key doesn't exist anymore
            expired_count += 1
    logger.info("Cleanup: found %d blocklist keys, %d expired", len(keys), expired_count)
    return {"status": "done", "checked": len(keys), "expired": expired_count}
