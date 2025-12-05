def calculate_scoring(income, overdue, max_delay):
    score = 600

    if income < 10000:
        score -= 100
    if overdue > 0:
        score -= overdue * 20
    if max_delay > 30:
        score -= 50

    risk = 1
    if score < 550:
        risk = 2
    if score < 500:
        risk = 3

    return score, risk
