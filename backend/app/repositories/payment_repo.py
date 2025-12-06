from app.db import get_connection


def get_payment_schedule_by_application(application_id: int):
    conn = get_connection()
    cur = conn.cursor()

    # 1️⃣ Знаходимо кредит за application_id
    cur.execute("""
        SELECT credit_id 
        FROM credit
        WHERE application_id = %s
        LIMIT 1;
    """, (application_id,))

    row = cur.fetchone()
    if not row:
        return None  # ще немає кредиту → графіку немає

    credit_id = row[0]

    # 2️⃣ Отримуємо графік платежів по кредиту
    cur.execute("""
        SELECT payment_id, payment_date, payment_amount, is_paid
        FROM payment_schedule
        WHERE credit_id = %s
        ORDER BY payment_date ASC;
    """, (credit_id,))

    schedule = [
        {
            "payment_id": r[0],
            "payment_date": str(r[1]),
            "payment_amount": float(r[2]),
            "is_paid": r[3]
        }
        for r in cur.fetchall()
    ]

    return {
        "application_id": application_id,
        "credit_id": credit_id,
        "schedule": schedule
    }


def get_schedule_row(payment_schedule_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT payment_id, credit_id, payment_amount
        FROM payment_schedule
        WHERE payment_id = %s
    """, (payment_schedule_id,))
    row = cur.fetchone()

    if not row:
        return None

    return {
        "payment_id": row[0],
        "credit_id": row[1],
        "payment_amount": row[2],
    }


def mark_schedule_paid(payment_schedule_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE payment_schedule
        SET is_paid = TRUE,
            paid_date = CURRENT_DATE
        WHERE payment_id = %s
    """, (payment_schedule_id,))

    conn.commit()


def insert_payment_log(credit_id: int, amount, payment_date, status_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO payment (credit_id, payment_date, amount, status_id)
        VALUES (%s, %s, %s, %s)
        RETURNING payment_id;
    """, (credit_id, payment_date, amount, status_id))

    payment_id = cur.fetchone()[0]
    conn.commit()
    return payment_id