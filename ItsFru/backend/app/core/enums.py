import enum

class PaymentMethodEnum(enum.Enum):
    CREDIT_CARD = "신용카드"
    DEBIT_CARD = "체크카드"
    BANK_TRANSFER = "계좌이체"
    MOBILE_PAYMENT = "모바일결제"
    MILEAGE = "마일리지"

class MembershipTierEnum(enum.Enum):
    REGULAR = "일반"
    SILVER = "실버"
    GOLD = "골드"
    PLATINUM = "플래티넘"

class QualityEnum(enum.Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"
    E = "E"

class FreshnessEnum(enum.Enum):
    FRESH = "Fresh"
    NORMAL = "Normal"
    OLD = "Old"