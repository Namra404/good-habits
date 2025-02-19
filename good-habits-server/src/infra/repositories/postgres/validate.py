import os
import hmac
import hashlib
import urllib.parse
import json

TELEGRAM_BOT_TOKEN = os.getenv("BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("BOT_TOKEN не задан в переменных окружения")

def check_telegram_auth(init_data: str) -> bool:
    params = {}
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=", 1)
            params[key] = value

    received_hash = params.pop("hash", None)
    params.pop("signature", None)  # Исключаем, если есть
    if not received_hash:
        print("Hash не найден в initData")
        return False

    sorted_items = sorted(params.items())
    # Попробуйте сначала с "\n"
    data_check_string = "\n".join(f"{key}={value}" for key, value in sorted_items)


    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    return computed_hash == received_hash

def extract_tg_id(init_data: str) -> str:
    params = {}
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=", 1)
            params[key] = value

    user_encoded = params.get("user")
    if user_encoded:
        try:
            user_json = urllib.parse.unquote(user_encoded)
            user_obj = json.loads(user_json)
            tg_id = user_obj.get("id")
            return str(tg_id) if tg_id is not None else None
        except Exception as e:
            print("Ошибка при декодировании user:", e)
            return None
    return None