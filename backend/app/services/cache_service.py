from __future__ import annotations

import hashlib
import json
import logging
from typing import Any

import app.extensions as ext

logger = logging.getLogger(__name__)

CACHE_PREFIX = "taskflow"
DEFAULT_TTL = 60


def _get_redis():
    """Get the Redis client, accessing it dynamically to handle late init."""
    return ext.redis_client


def _make_key(resource: str, user_id: str, query_params: dict | None = None) -> str:
    """Build a cache key with optional query hash."""
    if query_params:
        sorted_params = json.dumps(query_params, sort_keys=True)
        query_hash = hashlib.md5(sorted_params.encode()).hexdigest()[:12]
        return f"{CACHE_PREFIX}:{resource}:{user_id}:{query_hash}"
    return f"{CACHE_PREFIX}:{resource}:{user_id}"


def get_cached(key: str) -> Any | None:
    """Get a value from cache. Tracks hit/miss stats."""
    rc = _get_redis()
    result = rc.get(key)
    if result is not None:
        rc.incr("stats:cache:hits")
        logger.debug("Cache HIT: %s", key)
        return json.loads(result)
    rc.incr("stats:cache:misses")
    logger.debug("Cache MISS: %s", key)
    return None


def set_cached(key: str, data: Any, ttl: int = DEFAULT_TTL) -> None:
    """Set a value in cache with TTL."""
    _get_redis().setex(key, ttl, json.dumps(data))
    logger.debug("Cache SET: %s (ttl=%ds)", key, ttl)


def invalidate_user_tasks(user_id: str) -> None:
    """Delete all task cache keys for a user."""
    rc = _get_redis()
    pattern = f"{CACHE_PREFIX}:tasks:{user_id}:*"
    keys = rc.keys(pattern)
    if keys:
        rc.delete(*keys)
    logger.debug("Cache INVALIDATED: %s (%d keys)", pattern, len(keys) if keys else 0)


def get_cache_stats() -> dict:
    """Return cache hit/miss statistics."""
    rc = _get_redis()
    hits = int(rc.get("stats:cache:hits") or 0)
    misses = int(rc.get("stats:cache:misses") or 0)
    total = hits + misses
    return {
        "hits": hits,
        "misses": misses,
        "total": total,
        "hit_rate": round(hits / total * 100, 1) if total > 0 else 0,
    }
