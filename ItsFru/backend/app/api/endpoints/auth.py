from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, timezone, datetime
from api import schemas, models, crud
from api.dependencies import get_db, get_current_active_user, create_access_token, create_refresh_token
from core.config import settings
from passlib.context import CryptContext
from typing import List
from jose import jwt, JWTError

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/register", response_model=schemas.UserResponse)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    new_user = crud.create_user(db, user)
    access_token = create_access_token(data={"sub": new_user.email})
    refresh_token = create_refresh_token(data={"sub": new_user.email})
    crud.update_user_refresh_token(db, new_user.user_id, refresh_token)
    return {
        "user_id": new_user.user_id,
        "name": new_user.name,
        "email": new_user.email,
        "phone_number": new_user.phone_number,
        "total_mileage": new_user.total_mileage,
        "used_mileage": new_user.used_mileage,
        "membership_tier": new_user.membership_tier,
        "sms_consent" : new_user.sms_consent,
        "access_token": access_token,
        "refresh_token": refresh_token,  # 추가
        "token_type": "bearer",
    }

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(data={"sub": user.email})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh-token", response_model=schemas.Token)
async def refresh_token(refresh_token: schemas.RefreshToken, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token.refresh_token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        token_data = schemas.TokenPayload(**payload)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    user = crud.get_user_by_email(db, email=username)
    if user is None or user.refresh_token != refresh_token.refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    new_refresh_token = create_refresh_token(data={"sub": user.email})

    crud.update_user_refresh_token(db, user.user_id, new_refresh_token)

    return {"access_token": access_token, "refresh_token": new_refresh_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.UserResponse)
async def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    if not db_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    
    access_token = create_access_token(data={"sub": db_user.email})
    refresh_token = create_refresh_token(data={"sub": db_user.email})
    crud.update_user_refresh_token(db, db_user.user_id, refresh_token)
    return {
        "user_id": db_user.user_id,
        "name": db_user.name,
        "email": db_user.email,
        "phone_number": db_user.phone_number,
        "total_mileage": db_user.total_mileage,
        "used_mileage": db_user.used_mileage,
        "membership_tier": db_user.membership_tier,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@router.get("/users/me", response_model=schemas.UserInDB)
async def read_users_me(current_user: models.User = Depends(get_current_active_user)):
    return current_user

@router.post("/verify-password")
async def verify_password_endpoint(
    request: schemas.PasswordCheckRequest,
    current_user: models.User = Depends(get_current_active_user)
):
    if not verify_password(request.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid password")
    return {"success": True, "message": "Password verified successfully"}

@router.post("/change-password")
async def change_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    hashed_password = get_password_hash(password_change.new_password)
    crud.update_user_password(db, user_id=current_user.user_id, new_hashed_password=hashed_password)
    return {"success": True, "message": "Password changed successfully"}

@router.post("/withdraw")
async def withdraw(current_user: models.User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    crud.delete_user(db, user_id=current_user.user_id)
    crud.update_user_refresh_token(db, current_user.user_id, None)  # refresh_token 삭제
    return {"success": True, "message": "User account deactivated"}

@router.post("/reactivate")
async def reactivate_account(
    email: str,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_active:
        raise HTTPException(status_code=400, detail="User account is already active")
    
    crud.reactivate_user(db, user_id=user.user_id)
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    crud.update_user_refresh_token(db, user.user_id, new_refresh_token)
    return {"success": True, "message": "User account reactivated successfully", "refresh_token": new_refresh_token}

@router.get("/user/{user_id}/transactions", response_model=List[schemas.TransactionSummary])
def get_user_transactions(user_id: int, db: Session = Depends(get_db)):
    transactions = crud.get_user_transactions(db, user_id)
    return transactions

@router.get("/transaction/{transaction_id}/details", response_model=schemas.TransactionDetail)
def get_transaction_details(transaction_id: int, db: Session = Depends(get_db)):
    transaction = crud.get_transaction_with_items(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction