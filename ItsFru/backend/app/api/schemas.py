from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None

class UserInDB(UserBase):
    id: str
    hashed_password: str
    total_mileage: int
    used_mileage: int

class UserResponse(UserBase):
    id: str
    total_mileage: int
    used_mileage: int
    access_token: str  # 액세스 토큰 필드 추가
    token_type: str    # 토큰 타입 필드 추가

class PasswordCheckRequest(BaseModel):
    email: str
    password: str