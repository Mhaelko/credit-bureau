from app.db import get_connection


# --------------------------------------------------------
# GET CUSTOMER PROFILE
# --------------------------------------------------------
def get_customer_profile(customer_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            customer_id,
            login,
            full_name,
            birth_date,
            citizenship,              -- int FK
            monthly_income,
            employment_type_id,
            employment_term_months
        FROM customer
        WHERE customer_id = %s;
    """, (customer_id,))

    row = cur.fetchone()

    if not row:
        return {"error": "Customer not found"}

    return {
        "customer_id": row[0],
        "login": row[1],    # cannot be changed
        "full_name": row[2],
        "birth_date": row[3],
        "citizenship": row[4],
        "monthly_income": row[5],
        "employment_type_id": row[6],
        "employment_term_months": row[7]
    }


# --------------------------------------------------------
# UPDATE CUSTOMER PROFILE  (login is NOT updated)
# --------------------------------------------------------
def update_customer_profile(customer_id: int, data: dict):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE customer SET
            full_name = %s,
            birth_date = %s,
            citizenship = %s,
            monthly_income = %s,
            employment_type_id = %s,
            employment_term_months = %s
        WHERE customer_id = %s;
    """, (
        data["full_name"],
        data["birth_date"],
        data["citizenship"],             # integer FK
        data["monthly_income"],
        data["employment_type_id"],
        data["employment_term_months"],
        customer_id
    ))

    conn.commit()
    return {"status": "updated"}


# --------------------------------------------------------
# LOGIN — GET OR CREATE
# --------------------------------------------------------
def get_or_create_customer(login: str):
    conn = get_connection()
    cur = conn.cursor()

    # check if login exists
    cur.execute("""
        SELECT customer_id
        FROM customer
        WHERE login = %s;
    """, (login,))

    row = cur.fetchone()

    if row:
        return {
            "customer_id": row[0],
            "login": login,
            "status": "existing"
        }

    # create new customer (minimal defaults)
    cur.execute("""
        INSERT INTO customer
            (login, full_name, birth_date, citizenship, monthly_income, employment_type_id, employment_term_months)
        VALUES
            (%s, %s, '1990-01-01', 1, 0, 1, 0)
        RETURNING customer_id;
    """, (login, login))

    new_id = cur.fetchone()[0]
    conn.commit()

    return {
        "customer_id": new_id,
        "login": login,
        "status": "created"
    }


# --------------------------------------------------------
# GET CUSTOMER APPLICATIONS
# --------------------------------------------------------
def get_customer_applications(customer_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            a.application_id,
            a.amount_requested,
            a.created_at,
            a.status_id,
            s.status_name
        FROM application a
        LEFT JOIN application_status s ON s.status_id = a.status_id
        WHERE a.customer_id = %s
        ORDER BY a.created_at DESC;
    """, (customer_id,))

    rows = cur.fetchall()

    apps = []
    for r in rows:
        apps.append({
            "application_id": r[0],
            "amount_requested": r[1],
            "created_at": r[2],
            "status_id": r[3],
            "status_name": r[4]
        })

    return {"applications": apps}



# --------------------------------------------------------
# GET CUSTOMER LOANS
# --------------------------------------------------------
def get_customer_loans(customer_id: int):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT 
            c.credit_id,
            c.amount_approved,
            c.interest_rate,
            c.monthly_payment,
            c.start_date,
            c.end_date,
            a.application_id
        FROM credit c
        INNER JOIN application a ON a.application_id = c.application_id
        WHERE a.customer_id = %s;
    """, (customer_id,))

    rows = cur.fetchall()

    return {
        "loans": [
            {
                "credit_id": r[0],
                "amount_approved": r[1],
                "interest_rate": r[2],
                "monthly_payment": r[3],
                "start_date": r[4],
                "end_date": r[5],
                "application_id": r[6],
            }
            for r in rows
        ]
    }
