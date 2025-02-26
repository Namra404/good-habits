import asyncio
import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

from src.entity.user import User
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.user import PostgresUserRepository
from src.presentation.api.v1.main import app
from src.presentation.bot.bot_instance import bot, dp
from src.presentation.bot.config_reader import config
from src.presentation.bot.keyboards.startup_button import markup
from src.presentation.notification_service.scheduler import schedule_notifications
from src.presentation.notification_service.sender import send_notifications

load_dotenv()


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
    async with PostgresSessionFactory().get_session() as session:
        user_repo = PostgresUserRepository(session)
        user_id = message.from_user.id

        # Получаем фото профиля пользователя
        user_photos = await message.bot.get_user_profile_photos(user_id)

        # Проверяем, есть ли фото у пользователя
        file_id = user_photos.photos[0][-1].file_id  # Берём самое большое фото
        file_info = await message.bot.get_file(file_id)
        avatar_url = f"https://api.telegram.org/file/bot{message.bot.token}/{file_info.file_path}"

        # Создаем пользователя, если его нет
        await user_repo.create(User(
            tg_id=user_id,
            username=message.from_user.username,
            avatar_url=avatar_url
        ))

        await message.answer(
            f"Привет, {message.from_user.full_name}! 🎉",
            reply_markup=markup
        )


async def main():

    await asyncio.gather(
        schedule_notifications(),
        send_notifications(),
        dp.start_polling(bot)
    )



if __name__ == '__main__':
    try:
        print('Бот включен')
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Бот выключен")
