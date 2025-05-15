import logging
import os
import hmac
import hashlib
import urllib.parse
import json
from uuid import UUID

from fastapi import Depends, HTTPException, Header

from core.basic import BasicRoles
from infra.repositories.postgres.factories import PostgresSessionFactory
from infra.repositories.postgres.user import PostgresUserRepository



TELEGRAM_BOT_TOKEN = os.getenv("BOT_TOKEN")
if not TELEGRAM_BOT_TOKEN:
    raise ValueError("BOT_TOKEN не задан в переменных окружения")


# def check_telegram_auth(init_data: str) -> bool:
#     params = {}
#     for param in init_data.split("&"):
#         if "=" in param:
#             key, value = param.split("=", 1)
#             params[key] = value
#
#     received_hash = params.pop("hash", None)
#     params.pop("signature", None)  # Исключаем, если есть
#     if not received_hash:
#         print("Hash не найден в initData")
#         return False
#
#     sorted_items = sorted(params.items())
#     # Попробуйте сначала с "\n"
#     data_check_string = "\n".join(f"{key}={value}" for key, value in sorted_items)
#     secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
#     # secret_key = hmac.new(b"WebAppData", TELEGRAM_BOT_TOKEN.encode(), hashlib.sha256).digest()
#     computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()
#
#     return computed_hash == received_hash
def check_telegram_auth(init_data: str) -> bool:
    params = {}
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=", 1)
            params[key] = value

    received_hash = params.pop("hash", None)
    params.pop("signature", None)

    if not received_hash:
        return False

    # Проверка срока действия auth_date
    try:
        auth_date = int(params.get("auth_date", "0"))
    except Exception as e:
        print("❌ Ошибка при проверке времени:", e)
        return False

    # Хеширование по правилам Telegram
    sorted_items = sorted(params.items())
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


async def get_admin_user():

    async with PostgresSessionFactory().get_session() as session:
        user_repo = PostgresUserRepository(session)
        user = await user_repo.get_user_by_tg_id(int(tg_id))
        if not user:
            raise HTTPException(status_code=403, detail="Пользователь не найден")
        if user.role_id != UUID(BasicRoles.ADMIN.value):
            raise HTTPException(status_code=403, detail="Вы не администратор")

        return tg_id

async def is_admin(tg_id: int) -> bool:
    async with PostgresSessionFactory().get_session() as session:
        user_repo = PostgresUserRepository(session)
        user = await user_repo.get_user_by_tg_id(tg_id)
        if not user:
            return False
        return user.role_id == UUID(BasicRoles.ADMIN.value)