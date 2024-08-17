from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.endpoints import auth
from app.services.recognition_service import predict
import os

app = FastAPI()

# 환경 변수에서 CORS 설정 가져오기
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*").split(",")

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 전역 예외 처리기
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail},
    )

# 라우터 등록 (prefix 제거)
app.include_router(auth.router)

# /predict/ 엔드포인트 추가
@app.post("/predict/")
async def predict_endpoint(file: UploadFile = File(...)):
    return await predict(file)