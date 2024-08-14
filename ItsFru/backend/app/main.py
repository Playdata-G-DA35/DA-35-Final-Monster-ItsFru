from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (개발 환경에서만 사용)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

class User(BaseModel):
    email: str
    password: str

@app.post("/login")
async def login(user: User):
    if user.email == "test@example.com" and user.password == "password":
        return {"role": "user"}
    raise HTTPException(status_code=400, detail="Invalid credentials")

# FastAPI 서버 실행
# 터미널에서 다음 명령어로 서버를 실행합니다: uvicorn main:app --reload