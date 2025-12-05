from fastapi import APIRouter
from app.repositories.customer_repo import get_or_create_customer

router = APIRouter()

@router.post("/login")
def login(data: dict):
    login = data["login"].strip().lower()

    # Якщо менеджер — просто повертаємо логін
    if login == "manager":
        return { "login": "manager" }

    # Borrower login
    customer = get_or_create_customer(login)

    return {
        "login": login,
        "customer_id": customer["customer_id"]
    }
