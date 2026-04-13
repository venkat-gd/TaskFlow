class TestErrorHandler:
    """Tests for global error handlers."""

    def test_404_returns_json(self, client):
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
        data = response.get_json()
        assert data["error"]["code"] == "NOT_FOUND"

    def test_405_method_not_allowed(self, client):
        response = client.put("/api/auth/login")
        assert response.status_code == 405
        data = response.get_json()
        assert "error" in data


class TestIntegrityAndServerErrors:
    """Tests for IntegrityError and 500 handlers."""

    def test_register_duplicate_triggers_409(self, client, sample_user):
        """Duplicate email handled at application level returns 409."""
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "dup",
                "password": "Strong@123",
            },
        )
        assert response.status_code == 409


class TestPasswordValidation:
    """Additional password complexity tests."""

    def test_register_password_no_lowercase(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "user",
                "password": "ALLCAPS@123",
            },
        )
        assert response.status_code == 422

    def test_register_password_no_digit(self, client):
        response = client.post(
            "/api/auth/register",
            json={
                "email": "test@example.com",
                "username": "user",
                "password": "NoDigits@Here",
            },
        )
        assert response.status_code == 422
