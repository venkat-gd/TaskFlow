from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from marshmallow import ValidationError

from app.models.user import User
from app.schemas.auth_schema import LoginSchema, RegisterSchema
from app.services.auth_service import (
    authenticate_user,
    generate_tokens,
    register_user,
    revoke_token,
)

auth_bp = Blueprint("auth", __name__)

register_schema = RegisterSchema()
login_schema = LoginSchema()


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    json_data = request.get_json()
    if json_data is None:
        return (
            jsonify(
                {"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}
            ),
            400,
        )

    try:
        data = register_schema.load(json_data)
    except ValidationError as err:
        return (
            jsonify(
                {
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Validation failed.",
                        "details": err.messages,
                    }
                }
            ),
            422,
        )

    if User.query.filter_by(email=data["email"]).first():
        return (
            jsonify(
                {"error": {"code": "CONFLICT", "message": "Email already registered."}}
            ),
            409,
        )

    user = register_user(data["email"], data["username"], data["password"])
    tokens = generate_tokens(user.id)

    response = jsonify(
        {"message": "User registered successfully.", "user": user.to_dict()}
    )
    set_access_cookies(response, tokens["access_token"])
    set_refresh_cookies(response, tokens["refresh_token"])
    return response, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and set JWT cookies."""
    json_data = request.get_json()
    if json_data is None:
        return (
            jsonify(
                {"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}
            ),
            400,
        )

    try:
        data = login_schema.load(json_data)
    except ValidationError as err:
        return (
            jsonify(
                {
                    "error": {
                        "code": "VALIDATION_ERROR",
                        "message": "Validation failed.",
                        "details": err.messages,
                    }
                }
            ),
            422,
        )

    user = authenticate_user(data["email"], data["password"])
    if not user:
        return (
            jsonify(
                {
                    "error": {
                        "code": "UNAUTHORIZED",
                        "message": "Invalid email or password.",
                    }
                }
            ),
            401,
        )

    tokens = generate_tokens(user.id)

    response = jsonify({"message": "Login successful.", "user": user.to_dict()})
    set_access_cookies(response, tokens["access_token"])
    set_refresh_cookies(response, tokens["refresh_token"])
    return response, 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Issue a new access token using the refresh token."""
    current_user_id = get_jwt_identity()
    from flask_jwt_extended import create_access_token

    new_access_token = create_access_token(identity=current_user_id)

    response = jsonify({"message": "Token refreshed."})
    set_access_cookies(response, new_access_token)
    return response, 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Revoke current tokens and unset cookies."""
    jwt_data = get_jwt()
    revoke_token(jwt_data["jti"], token_type=jwt_data.get("type", "access"))

    response = jsonify({"message": "Logged out successfully."})
    unset_jwt_cookies(response)
    return response, 200
