from decimal import Decimal

def check_rules(income, amount, term, employment_term):
    income_ok = income >= 8000
    dti_ok = amount / term < income * Decimal("0.4")
    employment_ok = employment_term >= 6

    overall = income_ok and dti_ok and employment_ok
    return income_ok, dti_ok, employment_ok, overall
