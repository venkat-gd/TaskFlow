from unittest.mock import patch, MagicMock


class TestHealth:
    """Tests for GET /api/health."""

    def test_health_check_returns_200(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.get_json()
        assert data["status"] == "healthy"
        assert "database" in data["services"]
        assert "redis" in data["services"]

    def test_health_check_db_up(self, client):
        response = client.get("/api/health")
        data = response.get_json()
        assert data["services"]["database"] == "up"

    def test_health_check_redis_up(self, client):
        response = client.get("/api/health")
        data = response.get_json()
        assert data["services"]["redis"] == "up"

    def test_health_check_db_down(self, client):
        with patch("app.api.health.db") as mock_db:
            mock_db.text = MagicMock(side_effect=Exception("DB down"))
            mock_db.session.execute.side_effect = Exception("DB down")
            response = client.get("/api/health")
            data = response.get_json()
            assert data["services"]["database"] == "down"
            assert data["status"] == "degraded"

    def test_health_check_redis_down(self, client):
        with patch("app.extensions.redis_client") as mock_redis:
            mock_redis.ping.side_effect = Exception("Redis down")
            response = client.get("/api/health")
            data = response.get_json()
            assert data["services"]["redis"] == "down"

    def test_health_check_redis_none(self, client):
        with patch("app.extensions.redis_client", None):
            response = client.get("/api/health")
            data = response.get_json()
            assert data["services"]["redis"] == "down"
