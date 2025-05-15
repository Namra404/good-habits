import asyncio
import logging
from contextlib import asynccontextmanager
from uuid import UUID
from fastapi import FastAPI, Request
from aiogram.filters import CommandStart
from aiogram.types import Message
from dotenv import load_dotenv

from core.basic import BasicRoles
from src.entity.user import User
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.user import PostgresUserRepository
from src.presentation.api.v1.main import app
from src.presentation.bot.bot_instance import bot, dp
from src.presentation.bot.config_reader import config
from src.presentation.bot.keyboards.startup_button import markup, admin_markup
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
        logging.info(user_id)
        # Получаем фото профиля пользователя
        user_photos = await message.bot.get_user_profile_photos(user_id)

        # Проверяем, есть ли фото у пользователя
        file_id = user_photos.photos[0][-1].file_id  # Берём самое большое фото
        file_info = await message.bot.get_file(file_id)
        avatar_url = f"https://api.telegram.org/file/bot{message.bot.token}/{file_info.file_path}"

        existing_user = await user_repo.get_user_by_tg_id(user_id)  # Предполагается, что такой метод есть

        if existing_user:
            # Если пользователь существует, обновляем его аватар
            logging.info(" существуе")
            if avatar_url:  # Обновляем только если есть новое фото
                user_data = {
                    "avatar_url": avatar_url
                }
                await user_repo.update(existing_user.id, user_data)
        else:
            logging.info("yt существуе")
            # Создаем нового пользователя, если его нет
            await user_repo.create(User(
                tg_id=user_id,
                username=message.from_user.username,
                avatar_url=avatar_url
            ))

        await message.answer(
            f"👋 Привет, {message.from_user.full_name}!\n\n"
            f"Рад тебя видеть в *Хэббит Хоттабыче*! 🧞‍♂️✨\n"
            f"Здесь ты сможешь развивать полезные привычки и получать награды 🪙 за свою настойчивость.\n\n"
            f"Нажимай и начнем"
            f"! 👇",
            reply_markup=markup,
            parse_mode="Markdown"
        )
        user = await user_repo.get_user_by_tg_id(user_id)
        if user.role_id == UUID(BasicRoles.ADMIN.value):
            await message.answer('Вы админ', reply_markup=admin_markup, parse_mode='HTML')

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
