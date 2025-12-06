from fastapi import APIRouter
from datetime import date

from app.repositories.payment_repo import (
    get_payment_schedule_by_application,
    get_schedule_row,
    mark_schedule_paid,
    insert_payment_log
)

router = APIRouter()


# =======================
#   ОТРИМАТИ ГРАФІК ПЛАТЕЖІВ
# =======================
@router.get("/application/{application_id}/payments")
def get_payments(application_id: int):
    data = get_payment_schedule_by_application(application_id)
    return data or {"message": "No payment schedule found"}


# =======================
#   ОПЛАТИТИ ПЛАТІЖ
# =======================
@router.post("/pay/{payment_schedule_id}")
def pay(payment_schedule_id: int):

    # 1️⃣ Отримати запис із графіка платежів
    row = get_schedule_row(payment_schedule_id)
    if not row:
        return {"error": "payment schedule row not found"}

    credit_id = row["credit_id"]
    amount = row["payment_amount"]

    # 2️⃣ Оновити графік платежів (mark as paid)
    mark_schedule_paid(payment_schedule_id)

    # 3️⃣ Додати запис в таблицю payment
    payment_id = insert_payment_log(
        credit_id=credit_id,
        amount=amount,
        payment_date=date.today(),
        status_id=2   # 2 = оплачено
    )

    return {
        "message": "Payment successful",
        "payment_id": payment_id,
        "schedule_updated": payment_schedule_id,
        "amount": amount
    }
