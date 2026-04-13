import re

from marshmallow import Schema, fields, validate, validates, ValidationError


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.String(
        required=True, validate=validate.Length(min=3, max=80)
    )
    password = fields.String(required=True, validate=validate.Length(min=8))

    @validates("password")
    def validate_password_complexity(self, value: str) -> None:
        if not re.search(r"[A-Z]", value):
            raise ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", value):
            raise ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r"\d", value):
            raise ValidationError("Password must contain at least one digit.")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValidationError(
                "Password must contain at least one special character."
            )


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True)
