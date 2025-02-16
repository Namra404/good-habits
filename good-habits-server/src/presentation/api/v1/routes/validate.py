import os
import hmac
import hashlib
from fastapi import APIRouter, HTTPException
from src.entity.init_data_model import InitDataModel  # Модель должна содержать поле initData

router = APIRouter()

TELEGRAM_BOT_TOKEN = os.getenv("BOT_TOKEN")


def check_telegram_auth(init_data: str) -> bool:
    data_dict = {}
    print(init_data)
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=")
            data_dict[key] = value
    hash_received = data_dict.pop("hash", None)
    if not hash_received:
        return False
    data_check_arr = [f"{key}={data_dict[key]}" for key in sorted(data_dict.keys())]
    data_check_string = "\n".join(data_check_arr)
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
    return computed_hash == hash_received


def extract_tg_id(init_data: str) -> str:
    data_dict = {}
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=")
            data_dict[key] = value
    return data_dict.get("id", None)


@router.post("/validate")
async def validate_init_data(data: InitDataModel):
    if check_telegram_auth(data.initData):
        tg_id = extract_tg_id(data.initData)
        if tg_id is None:
            raise HTTPException(status_code=400, detail="tg_id не найден")
        return {"status": "ok", "tg_id": tg_id}
    raise HTTPException(status_code=400, detail="Invalid initData")
