import asyncio
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

from src.presentation.api.v1.main import app
from src.presentation.bot.config_reader import config
from src.presentation.bot.keyboards.startup_button import markup

load_dotenv()

bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()


@asynccontextmanager
async def lifespan(app: FastAPI):
    webhook_url = config.WEBHOOK_URL  # Получаем URL вебхука
    await bot.set_webhook(
        url=webhook_url,
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info(f"Webhook set to {webhook_url}")
    yield
    await bot.delete_webhook()
    logging.info("Webhook removed")


@app.post("/webhook")
async def webhook(request: Request) -> None:
    logging.info("Received webhook request")
    update = await request.json()
    await dp.feed_update(bot, update)
    logging.info("Update processed")


@dp.message(CommandStart())
async def welcome(message: Message) -> None:
    await message.answer("Hello World!", reply_markup=markup)


async def main():
    await dp.start_polling(bot)


if __name__ == '__main__':
    try:
        print('Бот включен')
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Бот выключен")
