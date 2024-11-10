import asyncio
import os
from typing import AsyncGenerator

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv
from fastapi import FastAPI

from src.presentation.bot.keyboards.startup_button import markup

load_dotenv()


async def lifespan(app: FastAPI) -> AsyncGenerator:
    await bot.set_webhook(
        url=os.getenv("WEBHOOK_URL")+os.getenv("WEBHOOK_PATH"),
        drop_pending_updates=True,
        allowed_updates=dp.resolve_used_update_types()
    )
    yield
    await bot.session.close()


bot = Bot(token=os.getenv("BOT_TOKEN"))
dp = Dispatcher()
app = FastAPI(lifespan=lifespan)


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
