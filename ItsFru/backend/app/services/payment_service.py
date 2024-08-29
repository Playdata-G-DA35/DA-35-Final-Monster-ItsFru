# services/payment_service.py
from sqlalchemy.orm import Session
from api.models import Transaction, User

def process_mileage(db: Session, transaction_id: int):
    # 트랜잭션을 가져옵니다.
    transaction = db.query(Transaction).filter(Transaction.transaction_id == transaction_id).first()
    if not transaction:
        raise ValueError("Transaction not found")

    # 사용자 정보를 가져옵니다.
    user = db.query(User).filter(User.user_id == transaction.user_id).first()
    if not user:
        raise ValueError("User not found")

    # 사용한 마일리지와 적립할 마일리지 계산
    used_mileage = transaction.used_mileage
    earned_mileage = int(transaction.total_amount * 0.05)  # 예: 총 금액의 5% 적립

    # 사용자 마일리지 업데이트
    user.used_mileage += used_mileage
    user.total_mileage += earned_mileage

    # 트랜잭션에 적립된 마일리지 업데이트
    transaction.earned_mileage = earned_mileage

    # 변경 사항 커밋
    db.commit()