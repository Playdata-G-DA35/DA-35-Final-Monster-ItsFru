from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from decimal import Decimal
import tempfile
import os
import requests
import boto3
from api import crud, schemas
from api.models import User, Transaction, TransactionItem, StoreProduct, PaymentMethodEnum
from api.dependencies import get_db, get_current_active_user
from services import recognition_service
from core.config import settings

router = APIRouter()
s3_client = boto3.client('s3')

@router.get("/stores/{store_id}/products", response_model=List[schemas.StoreProductInDB])
def get_store_products(store_id: int, db: Session = Depends(get_db)):
    store_products = crud.get_store_products(db, store_id)
    if not store_products:
        raise HTTPException(status_code=404, detail="Store products not found")
    return store_products

@router.get("/stores/{store_id}/notices", response_model=List[schemas.NoticeInDB])
def get_store_notices(store_id: int, db: Session = Depends(get_db)):
    notices = crud.get_store_notices(db, store_id)
    if not notices:
        raise HTTPException(status_code=404, detail="Store notices not found")
    return notices

@router.post("/recognition-fruit", response_model=schemas.FruitAnalysisResponse)
async def recognize_fruit(
    store_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    temp_image_path = f"/tmp/{image.filename}"
    try:
        # 임시 파일로 이미지 저장
        with open(temp_image_path, "wb") as buffer:
            buffer.write(await image.read())

        # S3에 이미지 업로드
        s3_key = f"{settings.S3_RECOGNITION_REQUEST_FOLDER}/{store_id}_{current_user.user_id}_{image.filename}"
        if not s3_client.upload_file_to_s3(temp_image_path, s3_key):
            raise HTTPException(status_code=500, detail="Failed to upload image to S3")

        # S3 이미지 URL 생성
        s3_url = s3_client.generate_presigned_url(s3_key)
        if not s3_url:
            raise HTTPException(status_code=500, detail="Failed to generate S3 URL")

        # 코랩 노트북으로 S3 URL 전송
        colab_response = requests.post(settings.COLAB_NOTEBOOK_URL, json={"image_url": s3_url})
        if colab_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to process image in Colab")

        # 코랩에서 반환한 결과 URL로부터 JSON 다운로드
        result_url = colab_response.json()["result_url"]
        result_response = requests.get(result_url)
        if result_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to download result from S3")

        analysis_result = result_response.json()

        # 상품 정보 조회
        store_products = crud.get_store_products(db, store_id)
        matching_product = next((p for p in store_products if p.product.name.lower() == analysis_result["fruit_type"].lower()), None)
        
        if not matching_product:
            raise HTTPException(status_code=404, detail="Matching product not found in store")
        
        # 이미지 처리 로그 생성
        log = crud.create_image_processing_log(
            db, 
            user_id=current_user.user_id,
            store_id=store_id, 
            image_path=s3_key, 
            analysis_result={
                **analysis_result,
                "result_path": result_url  # 결과 이미지 URL 추가
            }
        )
        
        # 응답 생성
        response = schemas.FruitAnalysisResponse(
            fruit_type=analysis_result["fruit_type"],
            quality=analysis_result["quality"],
            freshness=analysis_result["freshness"],
            price=matching_product.price,
            discount_rate=Decimal(analysis_result["discount_rate"])
        )

        return response

    except Exception as e:
        # 에러 로깅
        print(f"Error in fruit recognition: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during fruit recognition")

    finally:
        # 임시 파일 삭제
        if os.path.exists(temp_image_path):
            os.remove(temp_image_path)

        # 요청 이미지 S3에서 삭제 (선택적)
        # s3_client.delete_object(s3_key)

@router.get("/store/{store_id}", response_model=schemas.StoreInfo)
def get_store_info(store_id: int, db: Session = Depends(get_db)):
    store = crud.get_store(db, store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return store

@router.post("/payment", response_model=schemas.PaymentResponse)
async def process_payment(
    payment: schemas.PaymentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # 매장 확인
    store = crud.get_store(db, store_id=payment.store_id)
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    # 총 금액 계산 및 재고 확인
    total_amount = Decimal('0')
    for item in payment.items:
        store_product = crud.get_store_product(db, store_id=payment.store_id, product_id=item.product_id)
        if not store_product or store_product.available_stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {item.product_id}")
        total_amount += Decimal(str(store_product.price)) * Decimal(str(item.quantity))

    # 마일리지 사용 확인
    if payment.use_mileage:
        if current_user.total_mileage - current_user.used_mileage < payment.use_mileage:
            raise HTTPException(status_code=400, detail="Insufficient mileage")
        total_amount -= Decimal(str(payment.use_mileage))

    # 결제 금액이 올바른지 확인
    if total_amount != Decimal(str(payment.total_amount)):
        raise HTTPException(status_code=400, detail="Invalid total amount")

    # 트랜잭션 생성
    transaction = Transaction(
        user_id=current_user.user_id,
        store_id=payment.store_id,
        total_amount=total_amount,
        payment_method=payment.payment_method,
        image_processing_used=payment.image_processing_used,  # 추가
        transaction_date=datetime.now(timezone.utc),
        used_mileage=payment.use_mileage,
        earned_mileage=int(total_amount * Decimal(str(settings.MILEAGE_RATE)))
    )
    db.add(transaction)
    db.flush()  # ID 생성을 위해 flush

    # 트랜잭션 아이템 생성 및 재고 감소
    for item in payment.items:
        store_product = crud.get_store_product(db, store_id=payment.store_id, product_id=item.product_id)
        transaction_item = TransactionItem(
            transaction_id=transaction.transaction_id,
            product_id=item.product_id,
            stock_id=item.stock_id,  # 추가
            log_id=item.log_id,  # 추가
            quantity=item.quantity,
            sale_price=store_product.price,
            discount_rate=item.discount_rate  # 추가
        )
        db.add(transaction_item)
        store_product.available_stock -= item.quantity

    # 사용자 마일리지 업데이트
    current_user.used_mileage += payment.use_mileage
    current_user.total_mileage += transaction.earned_mileage

    db.commit()

    return schemas.PaymentResponse(
        transaction_id=transaction.transaction_id,
        total_amount=transaction.total_amount,
        used_mileage=transaction.used_mileage,
        earned_mileage=transaction.earned_mileage
    )