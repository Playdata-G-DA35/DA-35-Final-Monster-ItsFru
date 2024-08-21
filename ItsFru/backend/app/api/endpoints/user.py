from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from api.schemas import UserResponse, UserInDB, UserCreate, UserUpdate
from db.session import get_db
from typing import Optional, Dict
from passlib.context import CryptContext
from services.payment_service import process_mileage
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수 로드
load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# bcrypt 해시 생성
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
example_hashed_password = pwd_context.hash("password")

# 가짜 데이터베이스로 사용할 딕셔너리
fake_user_db: Dict[str, UserInDB] = {
    "test@example.com": UserInDB(
        id="1",
        name="홍길동",
        email="test@example.com",
        phone="010-1234-5678",
        total_mileage=10000,
        used_mileage=0,
        hashed_password=example_hashed_password
    )
}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_email(email: str) -> Optional[UserInDB]:
    return fake_user_db.get(email)

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

@router.get("/user", response_model=UserInDB)
async def get_user_info(current_user: UserInDB = Depends(get_current_user)):
    return current_user

def add_user_to_db(user_data: UserCreate) -> UserInDB:
    new_user = UserInDB(
        id=str(len(fake_user_db) + 1),
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        total_mileage=0,
        used_mileage=0,
        hashed_password=pwd_context.hash(user_data.password)
    )
    fake_user_db[new_user.email] = new_user
    return new_user

def update_user(email: str, update_data: UserUpdate) -> Optional[UserInDB]:
    user = fake_user_db.get(email)
    if user:
        updated_user = user.copy(update=update_data.dict(exclude_unset=True))
        fake_user_db[email] = updated_user
        return updated_user
    return None

def delete_user_by_email(email: str) -> bool:
    if email in fake_user_db:
        del fake_user_db[email]
        return True
    return False

def process_user_mileage(transaction_id: int):
    try:
        process_mileage(None, transaction_id)
    except Exception as e:
        raise ValueError(f"Failed to process mileage: {str(e)}")