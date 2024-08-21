from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

# 실제 환경에서는 환경 변수 또는 안전한 방법으로 관리해야 합니다.
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://username:password@your-rds-endpoint.amazonaws.com:3306/dbname")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    # 실제 AWS RDS와 연결할 때 사용할 코드
    # db = SessionLocal()
    # try:
    #     yield db
    # finally:
    #     db.close()

    # 테스트 환경에서는 None을 반환하여 실제 DB 연결을 시도하지 않음
    yield None