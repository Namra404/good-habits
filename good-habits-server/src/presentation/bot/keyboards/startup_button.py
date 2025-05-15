# startup_button.py
import os
from aiogram.types import InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from dotenv import load_dotenv

load_dotenv()

web_app_url = os.getenv("WEB_APP_URL")
markup = (
    InlineKeyboardBuilder()
    .button(text="Open me", web_app=WebAppInfo(url=web_app_url))
).as_markup()

admin_app_url = f"{web_app_url}/admin"

admin_markup = (
    InlineKeyboardBuilder()
    .button(text="Админ-панель", web_app=WebAppInfo(url=admin_app_url))
    .as_markup()
)