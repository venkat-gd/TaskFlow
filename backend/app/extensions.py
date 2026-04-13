from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS
from flask_socketio import SocketIO

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
cors = CORS()
socketio = SocketIO()

redis_client = None


def init_redis(app) -> None:
    """Initialize Redis client from app config."""
    global redis_client
    if app.config.get("TESTING"):
        import fakeredis

        redis_client = fakeredis.FakeStrictRedis()
    else:
        import redis

        redis_client = redis.from_url(app.config["REDIS_URL"])
