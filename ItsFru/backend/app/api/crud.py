from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime
from passlib.context import CryptContext
from decimal import Decimal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def update_user_refresh_token(db: Session, user_id: int, refresh_token: str):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    db_user.refresh_token = refresh_token
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_refresh_token(db: Session, refresh_token: str):
    return db.query(models.User).filter(models.User.refresh_token == refresh_token).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        phone_number=user.phone_number,
        sms_consent=user.sms_consent,
        hashed_password=hashed_password,
        total_mileage=user.total_mileage,
        used_mileage=user.used_mileage,
        membership_tier=user.membership_tier,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user:
        update_data = user.model_dump(exclude_unset=True)
        if 'password' in update_data:
            update_data['hashed_password'] = get_password_hash(update_data.pop('password'))
        for key, value in update_data.items():
            setattr(db_user, key, value)
        db_user.updated_at = datetime.now()
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def delete_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user:
        db_user.is_active = False
        db_user.updated_at = datetime.now()
        db.commit()
        return True
    return False

def reactivate_user(db: Session, user_id: int):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user:
        db_user.is_active = True
        db_user.updated_at = datetime.now()
        db.commit()
        return True
    return False

def update_user_password(db: Session, user_id: int, new_hashed_password: str):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if db_user:
        db_user.hashed_password = new_hashed_password
        db_user.updated_at = datetime.now()
        db.commit()
        return True
    return False

# Store CRUD operations
def get_store(db: Session, store_id: int):
    return db.query(models.Store).filter(models.Store.store_id == store_id).first()

def get_stores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Store).offset(skip).limit(limit).all()

def create_store(db: Session, store: schemas.StoreCreate):
    db_store = models.Store(**store.model_dump())
    db.add(db_store)
    db.commit()
    db.refresh(db_store)
    return db_store

def update_store(db: Session, store_id: int, store: schemas.StoreUpdate):
    db_store = db.query(models.Store).filter(models.Store.store_id == store_id).first()
    if db_store:
        update_data = store.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_store, key, value)
        db_store.updated_at = datetime.now()
        db.commit()
        db.refresh(db_store)
        return db_store
    return None

def delete_store(db: Session, store_id: int):
    db_store = db.query(models.Store).filter(models.Store.store_id == store_id).first()
    if db_store:
        db.delete(db_store)
        db.commit()
        return True
    return False

# Product CRUD operations
def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.product_id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if db_product:
        update_data = product.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db_product.updated_at = datetime.now()
        db.commit()
        db.refresh(db_product)
        return db_product
    return None

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
        return True
    return False

# Transaction CRUD operations
def get_transaction(db: Session, transaction_id: int):
    return db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()

def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Transaction).offset(skip).limit(limit).all()

def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    try:
        db_transaction = models.Transaction(
            user_id=user_id,
            store_id=transaction.store_id,
            total_amount=transaction.total_amount,
            payment_method=transaction.payment_method,
            image_processing_used=transaction.image_processing_used,
            used_mileage=transaction.use_mileage,
            earned_mileage=calculate_earned_mileage(transaction.total_amount)
        )
        db.add(db_transaction)
        db.flush()

        for item in transaction.items:
            db_transaction_item = models.TransactionItem(
                transaction_id=db_transaction.transaction_id,
                product_id=item.product_id,
                stock_id=item.stock_id,
                log_id=item.log_id,
                quantity=item.quantity,
                sale_price=get_product_price(db, item.product_id),
                discount_rate=item.discount_rate
            )
            db.add(db_transaction_item)
            update_product_stock(db, item.product_id, item.quantity)

        update_user_mileage(db, user_id, transaction.use_mileage, db_transaction.earned_mileage)

        db.commit()
        db.refresh(db_transaction)
        return db_transaction
    except Exception as e:
        db.rollback()
        raise e

# def update_transaction(db: Session, transaction_id: int, transaction: schemas.TransactionUpdate):
#     db_transaction = db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
#     if db_transaction:
#         update_data = transaction.model_dump(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(db_transaction, key, value)
#         db.commit()
#         db.refresh(db_transaction)
#         return db_transaction
#     return None

def delete_transaction(db: Session, transaction_id: int):
    db_transaction = db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()
    if db_transaction:
        db.delete(db_transaction)
        db.commit()
        return True
    return False

def get_store_products(db: Session, store_id: int):
    return db.query(models.StoreProduct).filter(models.StoreProduct.store_id == store_id).all()

def get_store_notices(db: Session, store_id: int):
    return db.query(models.Notice).filter(models.Notice.store_id == store_id).all()

def create_notice(db: Session, notice: schemas.NoticeCreate):
    db_notice = models.Notice(**notice.model_dump())
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

def update_notice(db: Session, notice_id: int, notice: schemas.NoticeUpdate):
    db_notice = db.query(models.Notice).filter(models.Notice.notice_id == notice_id).first()
    if db_notice:
        update_data = notice.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_notice, key, value)
        db_notice.updated_at = datetime.now()
        db.commit()
        db.refresh(db_notice)
        return db_notice
    return None

def delete_notice(db: Session, notice_id: int):
    db_notice = db.query(models.Notice).filter(models.Notice.notice_id == notice_id).first()
    if db_notice:
        db.delete(db_notice)
        db.commit()
        return True
    return False

def create_store_product(db: Session, store_product: schemas.StoreProductCreate):
    db_store_product = models.StoreProduct(**store_product.model_dump())
    db.add(db_store_product)
    db.commit()
    db.refresh(db_store_product)
    return db_store_product

def update_store_product(db: Session, store_product_id: int, store_product: schemas.StoreProductUpdate):
    db_store_product = db.query(models.StoreProduct).filter(models.StoreProduct.store_product_id == store_product_id).first()
    if db_store_product:
        update_data = store_product.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_store_product, key, value)
        db_store_product.updated_at = datetime.now()
        db.commit()
        db.refresh(db_store_product)
        return db_store_product
    return None

def delete_store_product(db: Session, store_product_id: int):
    db_store_product = db.query(models.StoreProduct).filter(models.StoreProduct.store_product_id == store_product_id).first()
    if db_store_product:
        db.delete(db_store_product)
        db.commit()
        return True
    return False

def create_image_processing_log(db: Session, store_id: int, image_path: str, analysis_result: dict):
    db_log = models.ImageProcessingLog(
        store_id=store_id,
        image_path=image_path,
        fruit_type=analysis_result["fruit_type"],
        quality=analysis_result["quality"],
        freshness=analysis_result["freshness"],
        discount_rate=analysis_result["discount_rate"]
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_user_transactions(db: Session, user_id: int):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

def get_transaction_with_items(db: Session, transaction_id: int):
    return db.query(models.Transaction).filter(models.Transaction.transaction_id == transaction_id).first()

def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    db_transaction = models.Transaction(
        user_id=user_id,
        store_id=transaction.store_id,
        total_amount=transaction.total_amount,
        payment_method=transaction.payment_method,
        image_processing_used=transaction.image_processing_used,
        used_mileage=transaction.use_mileage,
        earned_mileage=calculate_earned_mileage(transaction.total_amount)
    )
    db.add(db_transaction)
    db.flush()

    for item in transaction.items:
        db_transaction_item = models.TransactionItem(
            transaction_id=db_transaction.transaction_id,
            product_id=item.product_id,
            stock_id=item.stock_id,
            log_id=item.log_id,
            quantity=item.quantity,
            sale_price=get_product_price(db, item.product_id),
            discount_rate=item.discount_rate
        )
        db.add(db_transaction_item)
        update_product_stock(db, item.product_id, item.quantity)

    update_user_mileage(db, user_id, transaction.use_mileage, db_transaction.earned_mileage)

    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def calculate_earned_mileage(total_amount: Decimal) -> int:
    return int(total_amount * Decimal('0.01'))  # 예: 1% 적립

def get_product_price(db: Session, product_id: int) -> Decimal:
    store_product = db.query(models.StoreProduct).filter(models.StoreProduct.product_id == product_id).first()
    return store_product.price if store_product else Decimal('0')

def update_product_stock(db: Session, product_id: int, quantity: int):
    store_product = db.query(models.StoreProduct).filter(models.StoreProduct.product_id == product_id).first()
    if store_product:
        store_product.available_stock -= quantity
        db.add(store_product)

def update_user_mileage(db: Session, user_id: int, used_mileage: int, earned_mileage: int):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user:
        user.used_mileage += used_mileage
        user.total_mileage += earned_mileage - used_mileage
        db.add(user)

def get_store_product_by_fruit_type(db: Session, store_id: int, fruit_type: str):
    return db.query(models.StoreProduct).join(models.Product).filter(
        models.StoreProduct.store_id == store_id,
        models.Product.fruit_type == fruit_type
    ).first()

def create_image_processing_log(db: Session, user_id: int, store_id: int, image_path: str, analysis_result: dict):
    db_log = models.ImageProcessingLog(
        user_id=user_id,
        store_id=store_id,
        image_path=image_path,
        result_path=analysis_result.get("result_path", ""),  # 결과 이미지 경로 추가
        fruit_type=analysis_result["fruit_type"],
        variety=analysis_result.get("variety", ""),  # 품종 정보 추가
        quality=analysis_result["quality"],
        freshness=analysis_result["freshness"],
        discount_rate=Decimal(analysis_result["discount_rate"])
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
