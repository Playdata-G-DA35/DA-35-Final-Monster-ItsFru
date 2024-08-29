from pydantic import BaseModel, EmailStr, Field, field_validator, validator
from typing import Optional, List
from datetime import datetime, timezone
from decimal import Decimal
from core.enums import PaymentMethodEnum, MembershipTierEnum, QualityEnum, FreshnessEnum

# User related schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone_number: Optional[str] = None
    sms_consent: bool = False

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)
    total_mileage: int = Field(default=0, ge=0)
    used_mileage: int = Field(default=0, ge=0)
    membership_tier: MembershipTierEnum = MembershipTierEnum.REGULAR
    is_active: bool = True

    @field_validator('password')
    @classmethod
    def password_complexity(cls, v: str) -> str:
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one number')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone_number: Optional[str] = None
    sms_consent: Optional[bool] = None
    password: Optional[str] = None
    total_mileage: Optional[int] = Field(default=None, ge=0)
    used_mileage: Optional[int] = Field(default=None, ge=0)
    membership_tier: Optional[MembershipTierEnum] = None
    is_active: Optional[bool] = None

class UserInDB(UserBase):
    user_id: int
    hashed_password: str
    total_mileage: int
    used_mileage: int
    membership_tier: MembershipTierEnum
    is_active: bool
    refresh_token: Optional[str] = None  # 추가
    refresh_token_expires_at: Optional[datetime] = None  # 추가
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    user_id: int
    email: EmailStr
    name: str
    phone_number: Optional[str]
    total_mileage: int
    used_mileage: int
    membership_tier: MembershipTierEnum
    access_token: str
    refresh_token: str  # 추가
    token_type: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str  # 추가
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class RefreshToken(BaseModel):
    refresh_token: str

class TokenPayload(BaseModel):
    sub: str
    exp: datetime
    token_type: Optional[str] = "access"  # 수정

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class PasswordCheckRequest(BaseModel):
    password: str

# Store related schemas
class StoreBase(BaseModel):
    store_name: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class StoreCreate(StoreBase):
    pass

class StoreUpdate(StoreBase):
    pass

class StoreInDB(StoreBase):
    store_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class StoreWithProducts(StoreInDB):
    products: List['StoreProductInDB']

class StoreWithNotices(StoreInDB):
    notices: List['NoticeInDB']

# Product related schemas
class ProductBase(BaseModel):
    product_name: str
    description: Optional[str] = None
    fruit_type: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

class NewPassword(BaseModel):
    current_password: str
    new_password: str

class ProductInDB(ProductBase):
    product_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Transaction related schemas
class TransactionBase(BaseModel):
    user_id: int
    store_id: int
    total_amount: Decimal = Field(ge=0)
    payment_method: PaymentMethodEnum
    image_processing_used: bool = False

class TransactionCreate(TransactionBase):
    items: List['PaymentItemCreate']
    use_mileage: int = 0

class TransactionInDB(TransactionBase):
    transaction_id: int
    transaction_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class TransactionItemBase(BaseModel):
    product_id: int
    quantity: int
    sale_price: Decimal

class TransactionItemCreate(TransactionItemBase):
    transaction_id: int
    stock_id: int
    log_id: Optional[int] = None
    discount_rate: Decimal

class TransactionItem(TransactionItemCreate):
    transaction_item_id: int

    class Config:
        from_attributes = True

class TransactionSummary(BaseModel):
    transaction_id: int
    total_amount: Decimal
    transaction_date: datetime

    class Config:
        from_attributes = True

class TransactionDetail(TransactionSummary):
    items: List[TransactionItem]
    used_mileage: int
    earned_mileage: int
    image_processing_used: bool

    class Config:
        from_attributes = True

# Notice related schemas
class NoticeBase(BaseModel):
    title: str
    content: Optional[str] = None

class NoticeCreate(NoticeBase):
    store_id: int

class NoticeUpdate(NoticeBase):
    pass

class NoticeInDB(NoticeBase):
    notice_id: int
    store_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# StoreProduct related schemas
class StoreProductBase(BaseModel):
    product_id: int
    available_stock: int
    price: Decimal

class StoreProductCreate(StoreProductBase):
    store_id: int

class StoreProductUpdate(StoreProductBase):
    pass

class StoreProductInDB(StoreProductBase):
    store_product_id: int
    store_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Fruit Analysis related schemas
class FruitAnalysisResponse(BaseModel):
    fruit_type: str
    quality: QualityEnum
    freshness: FreshnessEnum
    price: Decimal
    discount_rate: Decimal

# Payment related schemas
class PaymentItemCreate(BaseModel):
    product_id: int
    quantity: int
    stock_id: int
    log_id: Optional[int] = None
    discount_rate: Decimal

class PaymentCreate(BaseModel):
    store_id: int
    items: List[PaymentItemCreate]
    total_amount: Decimal
    payment_method: PaymentMethodEnum
    use_mileage: int = 0
    image_processing_used: bool = False

class PaymentResponse(BaseModel):
    transaction_id: int
    total_amount: Decimal
    used_mileage: int
    earned_mileage: int

    class Config:
        from_attributes = True

# StoreInfo related schemas
class StoreInfo(BaseModel):
    store_id: int
    store_name: str
    location: str
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]

    class Config:
        from_attributes = True
