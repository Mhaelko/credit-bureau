from pydantic import BaseModel

class ApplicationCreate(BaseModel):
    customer_id: int
    amount_requested: float
    term_months: int
    purpose: str

class DecisionInput(BaseModel):
    manager_id: int
    final_decision: str
    comment: str | None = None
    corrected_amount: float | None = None
    corrected_term: int | None = None

from pydantic import BaseModel

class ProductUpdate(BaseModel):
    product_name: str
    description: str
    interest_rate: float
    min_term: int
    max_term: int
    min_amount: int
    max_amount: int
