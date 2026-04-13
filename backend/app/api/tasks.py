from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from marshmallow import ValidationError

from app.schemas.task_schema import TaskCreateSchema, TaskPatchSchema, TaskUpdateSchema
from app.services.task_service import (
    create_task,
    delete_task,
    get_task,
    list_tasks,
    patch_task,
    update_task,
)

tasks_bp = Blueprint("tasks", __name__)

create_schema = TaskCreateSchema()
update_schema = TaskUpdateSchema()
patch_schema = TaskPatchSchema()


@tasks_bp.route("", methods=["GET"])
@jwt_required()
def get_tasks():
    """List user's tasks with filtering, sorting, pagination."""
    user_id = get_jwt_identity()
    params = {
        "status": request.args.get("status"),
        "priority": request.args.get("priority"),
        "search": request.args.get("search"),
        "sort_by": request.args.get("sort_by", "created_at"),
        "order": request.args.get("order", "desc"),
        "page": request.args.get("page", 1),
        "per_page": request.args.get("per_page", 20),
    }
    result = list_tasks(user_id, params)
    return jsonify(result), 200


@tasks_bp.route("", methods=["POST"])
@jwt_required()
def create():
    """Create a new task."""
    user_id = get_jwt_identity()
    json_data = request.get_json()
    if json_data is None:
        return (
            jsonify(
                {"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}
            ),
            400,
        )

    try:
        data = create_schema.load(json_data)
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

    task = create_task(user_id, data)
    return jsonify({"message": "Task created.", "task": task.to_dict()}), 201


@tasks_bp.route("/<task_id>", methods=["GET"])
@jwt_required()
def get_single(task_id: str):
    """Get a single task by ID."""
    user_id = get_jwt_identity()
    task = get_task(task_id, user_id)
    if not task:
        return (
            jsonify({"error": {"code": "NOT_FOUND", "message": "Task not found."}}),
            404,
        )
    return jsonify({"task": task.to_dict()}), 200


@tasks_bp.route("/<task_id>", methods=["PUT"])
@jwt_required()
def full_update(task_id: str):
    """Full update of a task."""
    user_id = get_jwt_identity()
    task = get_task(task_id, user_id)
    if not task:
        return (
            jsonify({"error": {"code": "NOT_FOUND", "message": "Task not found."}}),
            404,
        )

    json_data = request.get_json()
    if json_data is None:
        return (
            jsonify(
                {"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}
            ),
            400,
        )

    try:
        data = update_schema.load(json_data)
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

    updated = update_task(task, data)
    return jsonify({"message": "Task updated.", "task": updated.to_dict()}), 200


@tasks_bp.route("/<task_id>", methods=["PATCH"])
@jwt_required()
def partial_update(task_id: str):
    """Partial update of a task."""
    user_id = get_jwt_identity()
    task = get_task(task_id, user_id)
    if not task:
        return (
            jsonify({"error": {"code": "NOT_FOUND", "message": "Task not found."}}),
            404,
        )

    json_data = request.get_json()
    if json_data is None:
        return (
            jsonify(
                {"error": {"code": "BAD_REQUEST", "message": "No input data provided."}}
            ),
            400,
        )

    try:
        data = patch_schema.load(json_data)
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

    updated = patch_task(task, data)
    return jsonify({"message": "Task updated.", "task": updated.to_dict()}), 200


@tasks_bp.route("/<task_id>", methods=["DELETE"])
@jwt_required()
def remove(task_id: str):
    """Delete a task."""
    user_id = get_jwt_identity()
    task = get_task(task_id, user_id)
    if not task:
        return (
            jsonify({"error": {"code": "NOT_FOUND", "message": "Task not found."}}),
            404,
        )

    delete_task(task)
    return jsonify({"message": "Task deleted."}), 200
