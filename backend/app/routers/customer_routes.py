from app.repositories.customer_repo import (
    get_customer_profile,
    update_customer_profile,
    get_customer_applications,
    get_customer_loans
)
from fastapi import APIRouter

router = APIRouter()

# Отримати профіль
@router.get("/{customer_id}")
def get_profile(customer_id: int):
    return get_customer_profile(customer_id)

# 🔧 Правильний endpoint для фронта
@router.post("/{customer_id}/update")
def update_profile(customer_id: int, data: dict):
    return update_customer_profile(customer_id, data)

# Історія заявок
@router.get("/{customer_id}/applications")
def applications(customer_id: int):
    return get_customer_applications(customer_id)

# Список кредитів
@router.get("/{customer_id}/loans")
def loans(customer_id: int):
    return get_customer_loans(customer_id)
