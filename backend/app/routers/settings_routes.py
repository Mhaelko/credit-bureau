from fastapi import APIRouter
from app.repositories.settings_repo import get_all_settings, get_settings_by_category, upsert_settings
from app.repositories.log_repo import write_log

router = APIRouter()


@router.get("")
def list_settings(category: str = None):
    if category:
        return {category: get_settings_by_category(category)}
    return get_all_settings()


@router.post("")
def save_settings(entries: list[dict]):
    """
    Body: [{"key": "penalty.daily_rate", "value": "0.002"}, ...]
    """
    updated = upsert_settings(entries)
    keys = ", ".join(e["key"] for e in entries[:5])
    if len(entries) > 5:
        keys += f" та ще {len(entries) - 5}"
    write_log("admin", f"Змінено налаштування: {keys}", actor="Адміністратор")
    return {"status": "ok", "updated": updated}
