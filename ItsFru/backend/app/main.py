from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from api.endpoints import auth, store #, admin
from core.config import settings

app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
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

@app.middleware("http")
async def check_file_size(request: Request, call_next):
    if request.method == "POST":
        if "content-length" in request.headers:
            content_length = int(request.headers["content-length"])
            if content_length > settings.MAX_UPLOAD_SIZE:
                return JSONResponse(
                    status_code=413,
                    content={"detail": "File too large"}
                )
    response = await call_next(request)
    return response

app.include_router(auth.router)
app.include_router(store.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the It's Fru"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)