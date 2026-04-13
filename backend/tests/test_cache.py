from app.services.cache_service import get_cache_stats
import app.extensions as ext


class TestCaching:
    """Tests for Redis caching behavior."""

    def test_first_request_cache_miss(self, auth_cookies):
        """First task list should be a cache miss."""
        ext.redis_client.set("stats:cache:hits", 0)
        ext.redis_client.set("stats:cache:misses", 0)

        auth_cookies.get("/api/tasks")
        stats = get_cache_stats()
        assert stats["misses"] >= 1

    def test_second_request_cache_hit(self, auth_cookies):
        """Second identical request should be a cache hit."""
        ext.redis_client.set("stats:cache:hits", 0)
        ext.redis_client.set("stats:cache:misses", 0)

        auth_cookies.get("/api/tasks")
        auth_cookies.get("/api/tasks")
        stats = get_cache_stats()
        assert stats["hits"] >= 1

    def test_write_invalidates_cache(self, auth_cookies):
        """Creating a task should invalidate the task list cache."""
        # Prime the cache
        auth_cookies.get("/api/tasks")

        ext.redis_client.set("stats:cache:hits", 0)
        ext.redis_client.set("stats:cache:misses", 0)

        # Create a task (invalidates cache)
        auth_cookies.post("/api/tasks", json={"title": "New"})

        # Next list should be a cache miss
        auth_cookies.get("/api/tasks")
        stats = get_cache_stats()
        assert stats["misses"] >= 1

    def test_cache_stats_endpoint(self, app):
        """Verify cache stats track correctly."""
        with app.app_context():
            ext.redis_client.set("stats:cache:hits", 10)
            ext.redis_client.set("stats:cache:misses", 5)
            stats = get_cache_stats()
            assert stats["hits"] == 10
            assert stats["misses"] == 5
            assert stats["hit_rate"] == 66.7
