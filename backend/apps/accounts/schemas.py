from typing import Optional

from pydantic import BaseModel, EmailStr


class UserFirebase(BaseModel):
    user_id: str
    username: str
    email: EmailStr
    is_verified_email: Optional[bool] = False
    is_active: Optional[bool] = False


class UserResponse(BaseModel):
    user: UserFirebase
