from sqlalchemy import Column, String, Integer, Boolean, DECIMAL, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from db.base import Base
import enum

class PaymentMethodEnum(enum.Enum):
    카드 = "카드"
    모바일 = "모바일"

class MembershipTierEnum(enum.Enum):
    일반 = "일반"
    실버 = "실버"
    골드 = "골드"
    플래티넘 = "플래티넘"

class QualityEnum(enum.Enum):
    A = "A"
    B = "B"
    C = "C"

class FreshnessEnum(enum.Enum):
    신선 = "신선"
    보통 = "보통"
    오래된 = "오래된"

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(20))
    sms_consent = Column(Boolean, default=False)
    password = Column(String(255), nullable=False)
    total_mileage = Column(Integer, default=0)  # 적립된 총 마일리지
    used_mileage = Column(Integer, default=0)  # 사용한 총 마일리지
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Store(Base):
    __tablename__ = 'stores'

    store_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    store_name = Column(String(255), nullable=False)
    location = Column(String(255))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Notice(Base):
    __tablename__ = 'notices'

    notice_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class Product(Base):
    __tablename__ = 'products'

    product_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    product_name = Column(String(255), nullable=False)
    description = Column(Text)
    fruit_type = Column(String(50))
    created_at = Column(DateTime)
    updated_at = Column(DateTime)

class ProductStock(Base):
    __tablename__ = 'product_stock'

    stock_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    purchase_price = Column(DECIMAL(10, 2))
    stock_date = Column(DateTime)
    created_at = Column(DateTime)

class Transaction(Base):
    __tablename__ = 'transactions'

    transaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethodEnum))
    image_processing_used = Column(Boolean, default=False)
    transaction_date = Column(DateTime)
    created_at = Column(DateTime)
    used_mileage = Column(Integer, default=0)  # 사용한 마일리지
    earned_mileage = Column(Integer, default=0)  # 적립된 마일리지

class TransactionItem(Base):
    __tablename__ = 'transaction_items'

    transaction_item_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey('transactions.transaction_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    stock_id = Column(Integer, ForeignKey('product_stock.stock_id'))
    log_id = Column(Integer, ForeignKey('image_processing_log.log_id'))
    quantity = Column(Integer, nullable=False)
    sale_price = Column(DECIMAL(10, 2))
    discount_rate = Column(DECIMAL(5, 2))
    created_at = Column(DateTime)

class StoreProduct(Base):
    __tablename__ = 'store_products'

    store_product_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    available_stock = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2))
    updated_at = Column(DateTime)

class ImageProcessingLog(Base):
    __tablename__ = 'image_processing_log'

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    image_path = Column(String(255))
    analysis_timestamp = Column(DateTime)
    result_path = Column(String(255))
    discount_rate = Column(DECIMAL(5, 2))
    fruit_type = Column(String(50))
    variety = Column(String(50))
    quality = Column(Enum(QualityEnum))
    freshness = Column(Enum(FreshnessEnum))
    created_at = Column(DateTime)


    '''
    결제 서비스(payment_service.py)에 추가할 함수

    def process_transaction(db: Session, transaction: Transaction):
    # 사용한 마일리지 차감
    user = db.query(User).filter(User.user_id == transaction.user_id).first()
    if user:
        user.used_mileage += transaction.used_mileage
        user.total_mileage += transaction.earned_mileage
        db.commit()


    유저 관련 뷰
    CREATE VIEW UserStatistics AS
    SELECT 
        u.user_id,
        u.name,
        u.email,
        COALESCE(SUM(t.total_amount), 0) AS total_purchase_amount,
        u.total_mileage,
        u.used_mileage,
        CASE
            WHEN COALESCE(SUM(t.total_amount), 0) >= 10000 THEN '플래티넘'
            WHEN COALESCE(SUM(t.total_amount), 0) >= 5000 THEN '골드'
            WHEN COALESCE(SUM(t.total_amount), 0) >= 1000 THEN '실버'
            ELSE '일반'
        END AS membership_tier
    FROM Users u
    LEFT JOIN Transactions t ON u.user_id = t.user_id
    GROUP BY u.user_id;


    스토어 관련 뷰 
    CREATE VIEW StoreStatistics AS
    SELECT 
        s.store_id,
        s.store_name,
        COUNT(DISTINCT t.user_id) AS total_customers,
        SUM(ti.quantity) AS total_sales,
        SUM(t.total_amount) AS total_revenue
    FROM Stores s
    LEFT JOIN Transactions t ON s.store_id = t.store_id
    LEFT JOIN Transaction_Items ti ON t.transaction_id = ti.transaction_id
    GROUP BY s.store_id;

    '''