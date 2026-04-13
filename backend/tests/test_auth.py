class TestRegister:
    """Tests for POST /api/auth/register."""

    def test_register_success(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "new@example.com",
                "username": "newuser",
                "password": "Strong@123",
            },
        )
        assert response.status_code == 201
        data = response.get_json()
        assert data["user"]["email"] == "new@example.com"
        assert data["user"]["username"] == "newuser"
        assert "password" not in data["user"]

    def test_register_duplicate_email(self, client, sample_user):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "another",
                "password": "Strong@123",
            },
        )
        assert response.status_code == 409
        assert response.get_json()["error"]["code"] == "CONFLICT"

    def test_register_weak_password_no_uppercase(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "weak@example.com",
                "username": "weakuser",
                "password": "weak@123",
            },
        )
        assert response.status_code == 422

    def test_register_weak_password_no_special(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "weak@example.com",
                "username": "weakuser",
                "password": "Weak12345",
            },
        )
        assert response.status_code == 422

    def test_register_weak_password_too_short(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "weak@example.com",
                "username": "weakuser",
                "password": "Sh@1",
            },
        )
        assert response.status_code == 422

    def test_register_invalid_email(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "not-an-email",
                "username": "user",
                "password": "Strong@123",
            },
        )
        assert response.status_code == 422

    def test_register_missing_fields(self, client):
        response = client.post("/api/auth/register", json={})
        assert response.status_code == 422

    def test_register_no_body(self, client):
        response = client.post("/api/auth/register", content_type="application/json")
        assert response.status_code == 400


class TestLogin:
    """Tests for POST /api/auth/login."""

    def test_login_success(self, client, sample_user):
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "Test@1234"},
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["user"]["email"] == "test@example.com"
        cookies = response.headers.getlist("Set-Cookie")
        assert any("access_token_cookie" in c for c in cookies)

    def test_login_wrong_password(self, client, sample_user):
        response = client.post(
            "/api/auth/login",
            json={"email": "test@example.com", "password": "WrongPass@1"},
        )
        assert response.status_code == 401
        assert response.get_json()["error"]["code"] == "UNAUTHORIZED"

    def test_login_nonexistent_user(self, client):
        response = client.post(
            "/api/auth/login",
            json={"email": "ghost@example.com", "password": "Any@1234"},
        )
        assert response.status_code == 401

    def test_login_invalid_email_format(self, client):
        response = client.post(
            "/api/auth/login",
            json={"email": "bad", "password": "Any@1234"},
        )
        assert response.status_code == 422

    def test_login_no_body(self, client):
        response = client.post("/api/auth/login", content_type="application/json")
        assert response.status_code == 400


class TestRefresh:
    """Tests for POST /api/auth/refresh."""

    def test_refresh_success(self, auth_cookies):
        response = auth_cookies.post("/api/auth/refresh")
        assert response.status_code == 200
        assert response.get_json()["message"] == "Token refreshed."

    def test_refresh_without_token(self, client):
        response = client.post("/api/auth/refresh")
        assert response.status_code == 401


class TestLogout:
    """Tests for POST /api/auth/logout."""

    def test_logout_success(self, auth_cookies):
        response = auth_cookies.post("/api/auth/logout")
        assert response.status_code == 200
        assert response.get_json()["message"] == "Logged out successfully."

    def test_logout_token_revoked(self, auth_cookies):
        auth_cookies.post("/api/auth/logout")
        # After logout, further authenticated requests should fail
        response = auth_cookies.post("/api/auth/logout")
        assert response.status_code == 401

    def test_logout_without_token(self, client):
        response = client.post("/api/auth/logout")
        assert response.status_code == 401
