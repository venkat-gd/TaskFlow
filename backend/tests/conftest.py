import pytest

from app import create_app
from app.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """Create application for testing."""
    app = create_app("testing")
    yield app


@pytest.fixture(autouse=True)
def db_session(app):
    """Recreate all tables for each test for full isolation."""
    with app.app_context():
        _db.create_all()
        yield _db.session
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app):
    """Flask test client."""
    return app.test_client()


@pytest.fixture()
def sample_user(db_session):
    """Create and return a sample user."""
    from app.models.user import User

    user = User(email="test@example.com", username="testuser")
    user.set_password("Test@1234")
    db_session.add(user)
    db_session.commit()
    return user


@pytest.fixture()
def auth_cookies(client, sample_user):
    """Log in the sample user and return the client with auth cookies set."""
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "Test@1234"},
    )
    assert response.status_code == 200
    return client
