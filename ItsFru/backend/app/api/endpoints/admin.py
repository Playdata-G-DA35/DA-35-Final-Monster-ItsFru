from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from app.api import crud, schemas
from app.api.dependencies import get_db
from core.config import settings

router = APIRouter()

def verify_admin_api_key(x_api_key: str = Header(...)):
    if x_api_key != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

@router.post("/stores/{store_id}/notices", response_model=schemas.NoticeInDB, dependencies=[Depends(verify_admin_api_key)])
def create_store_notice(store_id: int, notice: schemas.NoticeCreate, db: Session = Depends(get_db)):
    return crud.create_notice(db, notice)

@router.put("/notices/{notice_id}", response_model=schemas.NoticeInDB, dependencies=[Depends(verify_admin_api_key)])
def update_notice(notice_id: int, notice: schemas.NoticeUpdate, db: Session = Depends(get_db)):
    updated_notice = crud.update_notice(db, notice_id, notice)
    if not updated_notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return updated_notice

@router.delete("/notices/{notice_id}", dependencies=[Depends(verify_admin_api_key)])
def delete_notice(notice_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_notice(db, notice_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {"message": "Notice deleted successfully"}

@router.post("/stores/{store_id}/products", response_model=schemas.StoreProductInDB, dependencies=[Depends(verify_admin_api_key)])
def create_store_product(store_id: int, product: schemas.StoreProductCreate, db: Session = Depends(get_db)):
    return crud.create_store_product(db, product)

@router.put("/store-products/{store_product_id}", response_model=schemas.StoreProductInDB, dependencies=[Depends(verify_admin_api_key)])
def update_store_product(store_product_id: int, product: schemas.StoreProductUpdate, db: Session = Depends(get_db)):
    updated_product = crud.update_store_product(db, store_product_id, product)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Store product not found")
    return updated_product

@router.delete("/store-products/{store_product_id}", dependencies=[Depends(verify_admin_api_key)])
def delete_store_product(store_product_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_store_product(db, store_product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Store product not found")
    return {"message": "Store product deleted successfully"}