from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.extensions import db
from app.models.user import User

users_bp = Blueprint("users", __name__)


@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    """Get current user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": {"code": "NOT_FOUND", "message": "User not found."}}), 404
    return jsonify({"user": user.to_dict()}), 200


@users_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_me():
    """Update current user's profile."""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": {"code": "NOT_FOUND", "message": "User not found."}}), 404

    json_data = request.get_json()
    if json_data is None:
        return jsonify({"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}), 400

    if "username" in json_data:
        user.username = json_data["username"]
    db.session.commit()
    return jsonify({"message": "Profile updated.", "user": user.to_dict()}), 200
