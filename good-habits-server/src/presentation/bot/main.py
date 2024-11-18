import asyncio
import os
from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
import logging
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
from fastapi import FastAPI

from src.presentation.bot.config_reader import config
from src.presentation.bot.keyboards.startup_button import markup

load_dotenv()

bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Код, выполняющийся при запуске приложения
    webhook_url = config.WEBHOOK_URL  # Получаем URL вебхука
    await bot.set_webhook(
        url=webhook_url,
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info(f"Webhook set to {webhook_url}")
    yield  # Приложение работает
    # Код, выполняющийся при завершении работы приложения
    await bot.delete_webhook()
    logging.info("Webhook removed")


# Инициализация FastAPI с методом жизненного цикла
app = FastAPI(lifespan=lifespan)


# Маршрут для обработки вебхуков
@app.post("/webhook")
async def webhook(request: Request) -> None:
    logging.info("Received webhook request")
    update = await request.json()  # Получаем данные из запроса
    # Обрабатываем обновление через диспетчер (dp) и передаем в бот
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
