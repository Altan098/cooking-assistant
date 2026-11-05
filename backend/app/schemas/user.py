from datetime import datetime
from typing import Annotated

from pydantic import AfterValidator, BaseModel, ConfigDict, EmailStr, Field

# Адреса Ivan@mail.ru и ivan@mail.ru должны считаться одним пользователем.
NormalizedEmail = Annotated[EmailStr, AfterValidator(str.lower)]
NewPassword = Annotated[str, Field(min_length=8, max_length=100)]
ExistingPassword = Annotated[str, Field(min_length=1, max_length=100)]


class UserCreate(BaseModel):
    email: NormalizedEmail
    username: str = Field(min_length=3, max_length=100)
    password: NewPassword


class UserLogin(BaseModel):
    email: NormalizedEmail
    password: ExistingPassword


class PasswordChange(BaseModel):
    current_password: ExistingPassword
    new_password: NewPassword


class AccountDelete(BaseModel):
    password: ExistingPassword


class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
