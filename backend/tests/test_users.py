class TestGetMe:
    """Tests for GET /api/users/me."""

    def test_get_me_success(self, auth_cookies):
        response = auth_cookies.get("/api/users/me")
        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["email"] == "test@example.com"

    def test_get_me_unauthenticated(self, client):
        response = client.get("/api/users/me")
        assert response.status_code == 401


class TestUpdateMe:
    """Tests for PATCH /api/users/me."""

    def test_update_username(self, auth_cookies):
        response = auth_cookies.patch("/api/users/me", json={"username": "updated"})
        assert response.status_code == 200
        assert response.get_json()["user"]["username"] == "updated"

    def test_update_no_body(self, auth_cookies):
        response = auth_cookies.patch("/api/users/me", content_type="application/json")
        assert response.status_code == 400

    def test_update_unauthenticated(self, client):
        response = client.patch("/api/users/me", json={"username": "x"})
        assert response.status_code == 401
