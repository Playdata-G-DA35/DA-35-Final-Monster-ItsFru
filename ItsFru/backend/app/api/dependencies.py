from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from typing import Optional

from db.session import SessionLocal
from core.config import settings
from api import crud, models, schemas

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=username)
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def check_admin_permission(current_user: models.User = Depends(get_current_active_user)) -> models.User:
    if current_user.membership_tier != schemas.MembershipTierEnum.PLATINUM:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user

# 추가적인 의존성 함수들

def get_user_by_id(user_id: int, db: Session = Depends(get_db)) -> models.User:
    user = crud.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_store_by_id(store_id: int, db: Session = Depends(get_db)) -> models.Store:
    store = crud.get_store(db, store_id)
    if store is None:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

def get_product_by_id(product_id: int, db: Session = Depends(get_db)) -> models.Product:
    product = crud.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

def get_transaction_by_id(transaction_id: int, db: Session = Depends(get_db)) -> models.Transaction:
    transaction = crud.get_transaction(db, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "token_type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "token_type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        token_type: str = payload.get("token_type")
        if username is None or token_type != "access":
            raise credentials_exception
        token_data = schemas.TokenPayload(**payload)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.sub)
    if user is None:
        raise credentials_exception
    return user

# 엔드포인트 여러 곳에서 요청할 때, 지금은 사진찍을 때만 해서 문제 x
# from app.services import recognition_service

# def get_recognition_service():
#     return recognition_service

# 마일리지 사용 제한
# def check_mileage_usage(current_user: models.User = Depends(get_current_active_user), mileage_to_use: int = 0):
#     if current_user.total_mileage - current_user.used_mileage < mileage_to_use:
#         raise HTTPException(status_code=400, detail="Not enough mileage")
#     return current_user

# 파일 사이즈 제한(테스트 시라 필요 없을듯)
# from fastapi import UploadFile

# def check_file_size(file: UploadFile):
#     if file.size > settings.MAX_UPLOAD_SIZE:
#         raise HTTPException(status_code=413, detail="File too large")
#     return file