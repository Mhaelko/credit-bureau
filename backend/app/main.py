from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.dictionaries_routes import router as dictionaries_router
from app.routers.application_routes import router as application_router
from app.routers.customer_routes import router as customer_router
from app.routers.manager_routes import router as manager_router
from app.routers.auth_routes import router as auth_router
from app.routers.product_routes import router as product_router


app = FastAPI(title="Credit Bureau API")

# CORS FIX — ОБОВ’ЯЗКОВО ДЛЯ ФРОНТУ
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # дозволяємо всі домени
    allow_credentials=True,
    allow_methods=["*"],        # дозволяємо GET, POST, OPTIONS і т.д.
    allow_headers=["*"],
)

# Підключення роутерів
app.include_router(application_router, prefix="/application", tags=["Application"])
app.include_router(customer_router, prefix="/customer", tags=["Customer"])
app.include_router(manager_router, prefix="/manager", tags=["Manager"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(dictionaries_router, prefix="/dictionaries", tags=["Dictionaries"])
app.include_router(product_router,prefix="/product", tags=["product"])

@app.get("/")
def root():
    return {"status": "API is running"}
