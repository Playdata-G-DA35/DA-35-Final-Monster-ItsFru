# app/services/recognition_service.py
from fastapi import UploadFile, File
from typing import Dict

async def predict(file: UploadFile = File(...)) -> Dict[str, str]:
    # 파일을 수신하고 가상의 결과를 반환
    contents = await file.read()  # 실제로는 사용하지 않음
    fake_result = {"prediction": "This is a fake result for any image."}
    return fake_result