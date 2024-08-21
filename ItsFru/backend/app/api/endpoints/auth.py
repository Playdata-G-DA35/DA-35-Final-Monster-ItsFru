from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from api.schemas import UserLogin, UserResponse, PasswordCheckRequest
from .user import get_user_by_email, delete_user_by_email
from api.crud import verify_password as check_password
from db.session import get_db
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=UserResponse)
async def login(user: UserLogin):
    db_user = get_user_by_email(email=user.email)

    if db_user and check_password(user.password, db_user.hashed_password):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )
        return {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "phone": db_user.phone,
            "total_mileage": db_user.total_mileage,
            "used_mileage": db_user.used_mileage,
            "access_token": access_token, 
            "token_type": "bearer",       
        }
    raise HTTPException(status_code=400, detail="Invalid credentials")

@router.post("/verify-password")
async def verify_password_endpoint(request: PasswordCheckRequest):
    user = get_user_by_email(request.email)
    if user and check_password(request.password, user.hashed_password):
        return {"success": True, "message": "Password verified successfully"}
    raise HTTPException(status_code=400, detail="Invalid password")

@router.post("/withdraw")
async def withdraw(email: str, db: Session = Depends(get_db)):
    if delete_user_by_email(db, email):
        return {"success": True, "message": "User successfully deleted"}
    raise HTTPException(status_code=404, detail="User not found")

# 각주: 실제 AWS RDS 연동 시 SQLAlchemy를 사용하여 데이터베이스와 상호작용합니다.
# get_db()는 FastAPI의 의존성 주입을 통해 데이터베이스 세션을 제공합니다.
# 예시:
# def get_user_by_email(db: Session, email: str) -> Optional[UserInDB]:
#     user = db.query(UserModel).filter(UserModel.email == email).first()
#     if user:
#         return UserInDB.from_orm(user)