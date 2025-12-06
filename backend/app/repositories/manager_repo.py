from app.db import get_connection
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta
from app.services.credit_calculator import (
    calculate_monthly_payment,
    generate_payment_schedule,
    next_month_first_day
)


def get_applications_by_status(status_id: int):
    conn = get_connection()
    cur = conn.cursor()

    # Якщо статус 6 — показуємо і rejected(6), і auto_rejected(2)
    if status_id == 6:
        cur.execute("""
            SELECT 
                a.application_id,
                a.amount_requested,
                a.term_months,
                a.created_at,
                c.full_name
            FROM application a
            JOIN customer c ON c.customer_id = a.customer_id
            WHERE a.status_id IN (2, 6)
            ORDER BY a.created_at DESC
        """)
    else:
        cur.execute("""
            SELECT 
                a.application_id,
                a.amount_requested,
                a.term_months,
                a.created_at,
                c.full_name
            FROM application a
            JOIN customer c ON c.customer_id = a.customer_id
            WHERE a.status_id = %s
            ORDER BY a.created_at DESC
        """, (status_id,))

    rows = cur.fetchall()

    apps = []
    for r in rows:
        apps.append({
            "application_id": r[0],
            "amount_requested": r[1],
            "term_months": r[2],
            "created_at": r[3],
            "full_name": r[4],
        })

    return {"applications": apps}



def create_manager_decision(application_id: int, data):
    conn = get_connection()
    cur = conn.cursor()

    # 1️⃣ Зберігаємо рішення менеджера
    cur.execute("""
        INSERT INTO manager_decision 
            (application_id, manager_id, final_decision, comment, corrected_amount, corrected_term)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING decision_id;
    """, (
        application_id,
        data.manager_id,
        data.final_decision,
        data.comment,
        data.corrected_amount,
        data.corrected_term
    ))

    decision_id = cur.fetchone()[0]

    # 2️⃣ Отримуємо заявку
    cur.execute("""
        SELECT customer_id, amount_requested, term_months 
        FROM application
        WHERE application_id = %s
    """, (application_id,))
    customer_id, amount, term = cur.fetchone()

    # 3️⃣ Отримуємо поточні параметри кредитного продукту
    cur.execute("SELECT interest_rate FROM credit_product LIMIT 1")
    interest_rate = cur.fetchone()[0]

    # враховуємо виправлені значення
    amount = data.corrected_amount or amount
    term = data.corrected_term or term

    # Якщо відмова → просто оновити статус
    if data.final_decision != "approved":
        cur.execute(
            "UPDATE application SET status_id = 6 WHERE application_id=%s",
            (application_id,)
        )
        conn.commit()
        return {"decision_id": decision_id, "new_status": 6}

    # 4️⃣ Розрахунок платежу
    monthly_payment = calculate_monthly_payment(amount, term, interest_rate)

    start_date = next_month_first_day()
    end_date = start_date + relativedelta(months=term)

    # 5️⃣ Створюємо кредит
    cur.execute("""
        INSERT INTO credit (application_id, amount_approved, interest_rate, 
                            monthly_payment, start_date, end_date)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING credit_id;
    """, (
        application_id,
        amount,
        interest_rate,
        monthly_payment,
        start_date,
        end_date
    ))

    credit_id = cur.fetchone()[0]

    # 6️⃣ Генеруємо календар платежів
    schedule = generate_payment_schedule(amount, term, interest_rate)

    for item in schedule:
        cur.execute("""
            INSERT INTO payment_schedule (credit_id, payment_date, payment_amount)
            VALUES (%s, %s, %s)
        """, (
            credit_id,
            item["payment_date"],
            item["amount"]
        ))

    # 7️⃣ Оновлюємо статус заявки
    cur.execute("""
        UPDATE application SET status_id = 5
        WHERE application_id = %s
    """, (application_id,))

    conn.commit()

    return {
        "decision_id": decision_id,
        "credit_id": credit_id,
        "monthly_payment": monthly_payment,
        "new_status": 5
    }
