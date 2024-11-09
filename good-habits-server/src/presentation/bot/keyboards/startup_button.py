import os

from aiogram.types import InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from dotenv import load_dotenv

load_dotenv()

web_app_url = os.getenv("WEBAPP_URL")
markup = (
    InlineKeyboardBuilder()
    .button(text="Open me", web_app=WebAppInfo(url='https://www.google.com/'))
).as_markup()
