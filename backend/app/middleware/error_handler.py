import logging

from flask import Flask, jsonify
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import HTTPException

logger = logging.getLogger(__name__)


def register_error_handlers(app: Flask) -> None:
    """Register global error handlers that return consistent JSON."""

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        return (
            jsonify(
                {
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Validation failed.",
                        "details": error.messages,
                    }
                }
            ),
            422,
        )

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(error: IntegrityError):
        logger.error("Database integrity error: %s", error)
        return (
            jsonify(
                {
                    "error": {
                        "code": "CONFLICT",
                        "message": "A database constraint was violated.",
                        "details": {},
                    }
                }
            ),
            409,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(error: HTTPException):
        return (
            jsonify(
                {
                    "error": {
                        "code": error.name.upper().replace(" ", "_"),
                        "message": error.description,
                        "details": {},
                    }
                }
            ),
            error.code,
        )

    @app.errorhandler(Exception)
    def handle_generic_exception(error: Exception):
        logger.exception("Unhandled exception: %s", error)
        return (
            jsonify(
                {
                    "error": {
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "An unexpected error occurred.",
                        "details": {},
                    }
                }
            ),
            500,
        )
