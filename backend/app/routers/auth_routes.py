import os
import bcrypt
from fastapi import APIRouter, HTTPException
from app.schemas import RegisterInput, LoginInput
from app.repositories.customer_repo import get_customer_by_login, create_customer

router = APIRouter()

MANAGER_PASSWORD = os.getenv("MANAGER_PASSWORD", "1234")
ADMIN_PASSWORD   = os.getenv("ADMIN_PASSWORD", "admin")


@router.post("/register")
def register(data: RegisterInput):
    login = data.login.strip().lower()

    if login in ("manager", "admin"):
        raise HTTPException(status_code=400, detail=f"Login '{login}' is reserved")

    if len(login) < 3:
        raise HTTPException(status_code=400, detail="Login must be at least 3 characters")

    if len(data.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    existing = get_customer_by_login(login)
    if existing:
        raise HTTPException(status_code=409, detail="Логін вже зайнятий")

    password_hash = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    customer = create_customer(login, password_hash, data.full_name)

    return {
        "customer_id": customer["customer_id"],
        "login": login,
        "status": "registered"
    }


@router.post("/login")
def login(data: LoginInput):
    login = data.login.strip().lower()

    # ---- Manager ----
    if login == "admin":
        if data.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=401, detail="Невірний пароль")
        return {"login": "admin"}

    if login == "manager":
        if data.password != MANAGER_PASSWORD:
            raise HTTPException(status_code=401, detail="Невірний пароль")
        return {"login": "manager"}

    # ---- Borrower ----
    customer = get_customer_by_login(login)
    if not customer:
        raise HTTPException(status_code=401, detail="Користувача не знайдено")

    password_hash = customer.get("password_hash")
    if password_hash:
        if not bcrypt.checkpw(data.password.encode(), password_hash.encode()):
            raise HTTPException(status_code=401, detail="Невірний пароль")
    # Якщо password_hash == NULL (старий користувач) — дозволяємо вхід без перевірки (міграційний режим)

    return {
        "login": login,
        "customer_id": customer["customer_id"]
    }
