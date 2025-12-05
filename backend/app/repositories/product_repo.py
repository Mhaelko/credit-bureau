from app.db import get_connection
from datetime import datetime

def get_product():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT product_id, product_name, description, interest_rate,
               min_term_months, max_term_months, min_amount, max_amount
        FROM credit_product
        WHERE deleted_at IS NULL
        LIMIT 1;
    """)

    row = cur.fetchone()

    if not row:
        return None

    return {
        "product_id": row[0],
        "product_name": row[1],
        "description": row[2],
        "interest_rate": row[3],
        "min_term": row[4],
        "max_term": row[5],
        "min_amount": row[6],
        "max_amount": row[7],
    }


def update_product(product_id, data):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE credit_product
        SET product_name=%s,
            description=%s,
            interest_rate=%s,
            min_term_months=%s,
            max_term_months=%s,
            min_amount=%s,
            max_amount=%s,
            updated_at=%s
        WHERE product_id=%s
    """, (
        data.product_name,
        data.description,
        data.interest_rate,
        data.min_term,
        data.max_term,
        data.min_amount,
        data.max_amount,
        datetime.now(),
        product_id
    ))

    conn.commit()
    return {"status": "updated"}
