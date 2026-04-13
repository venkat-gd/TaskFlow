from __future__ import annotations

from marshmallow import Schema, fields, validate, validates, ValidationError
from datetime import datetime, timezone

from app.models.task import TaskStatus, TaskPriority


class TaskCreateSchema(Schema):
    title = fields.String(required=True, validate=validate.Length(min=1, max=200))
    description = fields.String(allow_none=True, load_default=None)
    status = fields.String(
        load_default=TaskStatus.TODO.value,
        validate=validate.OneOf([s.value for s in TaskStatus]),
    )
    priority = fields.String(
        load_default=TaskPriority.MEDIUM.value,
        validate=validate.OneOf([p.value for p in TaskPriority]),
    )
    due_date = fields.DateTime(allow_none=True, load_default=None)
    position = fields.Integer(load_default=0)

    @validates("due_date")
    def validate_due_date_future(self, value: datetime | None) -> None:
        if value and value < datetime.now(timezone.utc):
            raise ValidationError("Due date must be in the future.")


class TaskUpdateSchema(TaskCreateSchema):
    title = fields.String(validate=validate.Length(min=1, max=200))


class TaskPatchSchema(Schema):
    title = fields.String(validate=validate.Length(min=1, max=200))
    description = fields.String(allow_none=True)
    status = fields.String(validate=validate.OneOf([s.value for s in TaskStatus]))
    priority = fields.String(validate=validate.OneOf([p.value for p in TaskPriority]))
    due_date = fields.DateTime(allow_none=True)
    position = fields.Integer()
