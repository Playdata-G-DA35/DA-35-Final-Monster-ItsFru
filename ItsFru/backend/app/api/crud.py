from passlib.context import CryptContext

# bcrypt 해시 생성 및 검증을 위한 컨텍스트 설정
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    주어진 평문 비밀번호가 해시된 비밀번호와 일치하는지 확인합니다.

    :param plain_password: 사용자가 입력한 평문 비밀번호
    :param hashed_password: 데이터베이스에 저장된 해시된 비밀번호
    :return: 비밀번호가 일치하면 True, 그렇지 않으면 False
    """
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """
    주어진 비밀번호를 해시합니다.

    :param password: 사용자가 입력한 평문 비밀번호
    :return: 해시된 비밀번호
    """
    return pwd_context.hash(password)