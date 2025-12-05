from app.db import get_connection

def get_applications_by_status(status_id: int):
    conn = get_connection()
    cur = conn.cursor()

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

    cur.execute("""
        INSERT INTO manager_decision 
            (application_id, manager_id, final_decision, comment, corrected_amount, corrected_term)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING decision_id;
    """, (application_id, data.manager_id, data.final_decision, data.comment, data.corrected_amount,
          data.corrected_term))

    decision_id = cur.fetchone()[0]

    new_status = 5 if data.final_decision == "approved" else 6
    cur.execute("UPDATE application SET status_id=%s WHERE application_id=%s", (new_status, application_id))

    return {"decision_id": decision_id, "new_status": new_status}