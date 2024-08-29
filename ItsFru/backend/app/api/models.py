from sqlalchemy import Column, String, Integer, Boolean, DECIMAL, DateTime, ForeignKey, Enum, Text, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.base import Base
from core.enums import PaymentMethodEnum, MembershipTierEnum, QualityEnum, FreshnessEnum

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(20))
    sms_consent = Column(Boolean, default=False)
    hashed_password = Column(String(255), nullable=False)
    refresh_token = Column(String, nullable=True)
    refresh_token_expires_at = Column(DateTime, nullable=True)
    total_mileage = Column(Integer, default=0)
    used_mileage = Column(Integer, default=0)
    membership_tier = Column(Enum(MembershipTierEnum), default=MembershipTierEnum.REGULAR)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    transactions = relationship("Transaction", back_populates="user")
    image_processing_logs = relationship("ImageProcessingLog", back_populates="user")

class Store(Base):
    __tablename__ = 'stores'

    store_id = Column(Integer, primary_key=True, autoincrement=True)
    store_name = Column(String(255), nullable=False)
    location = Column(String(255))
    latitude = Column(DECIMAL(9, 6))
    longitude = Column(DECIMAL(9, 6))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    notices = relationship("Notice", back_populates="store")
    product_stocks = relationship("ProductStock", back_populates="store")
    transactions = relationship("Transaction", back_populates="store")
    store_products = relationship("StoreProduct", back_populates="store")
    image_processing_logs = relationship("ImageProcessingLog", back_populates="store")

class Notice(Base):
    __tablename__ = 'notices'

    notice_id = Column(Integer, primary_key=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    store = relationship("Store", back_populates="notices")

class Product(Base):
    __tablename__ = 'products'

    product_id = Column(Integer, primary_key=True, autoincrement=True)
    product_name = Column(String(255), nullable=False)
    description = Column(Text)
    fruit_type = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    product_stocks = relationship("ProductStock", back_populates="product")
    transaction_items = relationship("TransactionItem", back_populates="product")
    store_products = relationship("StoreProduct", back_populates="product")

class ProductStock(Base):
    __tablename__ = 'product_stock'

    stock_id = Column(Integer, primary_key=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    purchase_price = Column(DECIMAL(10, 2))
    stock_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    store = relationship("Store", back_populates="product_stocks")
    product = relationship("Product", back_populates="product_stocks")
    transaction_items = relationship("TransactionItem", back_populates="stock")

    __table_args__ = (Index('idx_store_product', 'store_id', 'product_id'),)

class Transaction(Base):
    __tablename__ = 'transactions'

    transaction_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    total_amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethodEnum))
    image_processing_used = Column(Boolean, default=False)
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    used_mileage = Column(Integer, default=0)
    earned_mileage = Column(Integer, default=0)

    user = relationship("User", back_populates="transactions")
    store = relationship("Store", back_populates="transactions")
    transaction_items = relationship("TransactionItem", back_populates="transaction")

    __table_args__ = (Index('idx_user_transaction_date', 'user_id', 'transaction_date'),)

class TransactionItem(Base):
    __tablename__ = 'transaction_items'

    transaction_item_id = Column(Integer, primary_key=True, autoincrement=True)
    transaction_id = Column(Integer, ForeignKey('transactions.transaction_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    stock_id = Column(Integer, ForeignKey('product_stock.stock_id'))
    log_id = Column(Integer, ForeignKey('image_processing_log.log_id'))
    quantity = Column(Integer, nullable=False)
    sale_price = Column(DECIMAL(10, 2))
    discount_rate = Column(DECIMAL(5, 2))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    transaction = relationship("Transaction", back_populates="transaction_items")
    product = relationship("Product", back_populates="transaction_items")
    stock = relationship("ProductStock", back_populates="transaction_items")
    image_processing_log = relationship("ImageProcessingLog", back_populates="transaction_items")

class StoreProduct(Base):
    __tablename__ = 'store_products'

    store_product_id = Column(Integer, primary_key=True, autoincrement=True)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.product_id'), nullable=False)
    available_stock = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    store = relationship("Store", back_populates="store_products")
    product = relationship("Product", back_populates="store_products")

    __table_args__ = (Index('idx_store_product', 'store_id', 'product_id'),)

class ImageProcessingLog(Base):
    __tablename__ = 'image_processing_log'

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    store_id = Column(Integer, ForeignKey('stores.store_id'), nullable=False)
    image_path = Column(String(255))
    analysis_timestamp = Column(DateTime(timezone=True), server_default=func.now())
    result_path = Column(String(255))
    discount_rate = Column(DECIMAL(5, 2))
    fruit_type = Column(String(50))
    variety = Column(String(50))
    quality = Column(Enum(QualityEnum))
    freshness = Column(Enum(FreshnessEnum))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="image_processing_logs")
    store = relationship("Store", back_populates="image_processing_logs")
    transaction_items = relationship("TransactionItem", back_populates="image_processing_log")