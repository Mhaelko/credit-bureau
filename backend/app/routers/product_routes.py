from fastapi import APIRouter
from app.schemas import ProductUpdate
from app.repositories.product_repo import get_product, update_product

router = APIRouter()

@router.get("")
def get_credit_product():
    product = get_product()
    return product or {"error": "No product found"}

@router.post("/update/{product_id}")
def update_credit_product(product_id: int, data: ProductUpdate):
    return update_product(product_id, data)
