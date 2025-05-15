import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

from aiogram.types import FSInputFile
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.notification_model import NotificationModel
from src.infra.repositories.postgres.user import PostgresUserRepository
from src.presentation.bot.bot_instance import bot

# Инициализация фабрики сессий и репозитория

session_factory = PostgresSessionFactory()
DEFAULT_IMAGE_PATH = "src/static/images/cool.png"
SRC_DIR = Path(__file__).resolve().parents[3]
ABS_IMAGE_PATH = str(SRC_DIR / DEFAULT_IMAGE_PATH)



async def send_notification_to_user(session: AsyncSession, user_id: UUID, message: str):
    user_repo = PostgresUserRepository(session)
    user = await user_repo.get_user_by_id(user_id)
    if not user:
        raise ValueError(f"Пользователь с ID {user_id} не найден")
    return user.tg_id, message  # Возвращаем данные для отправки вне транзакции


async def send_congratulatory_message(session: AsyncSession, user_id: UUID, progress_id: UUID):
    """Отправка поздравительного сообщения с картинкой."""
    try:
        # Получаем Telegram ID пользователя
        user_repo = PostgresUserRepository(session)
        tg_id, _ = await send_notification_to_user(session, user_id,
                                                   "")  # Пустое сообщение, т.к. используем только tg_id

        # Поздравительное сообщение
        message = "🎉 Поздравляем! Вы завершили все чек-ины за сегодня! Отличная работа! 🚀"

        # Проверяем, существует ли файл
        if not os.path.exists(ABS_IMAGE_PATH):
            raise FileNotFoundError(f"Файл {ABS_IMAGE_PATH} не найден")

        # Используем FSInputFile для локального файла
        photo = FSInputFile(ABS_IMAGE_PATH)

        # Отправляем сообщение с картинкой
        await bot.send_photo(
            chat_id=tg_id,
            photo=photo,
            caption=message,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка отправки поздравительного сообщения: {e}")


# async def send_notification_to_user(session: AsyncSession, user_id: UUID, message: str):
#     user_repo = PostgresUserRepository(session)
#     user = await user_repo.get_user_by_id(user_id)
#     if not user:
#         raise ValueError(f"Пользователь с ID {user_id} не найден")
#     return user.tg_id, message  # Возвращаем данные для отправки вне транзакции
#
#
# async def send_congratulatory_message(session: AsyncSession, user_id: UUID, progress_id: UUID):
#     """Отправка поздравительного сообщения с картинкой."""
#     try:
#         # Получаем Telegram ID пользователя
#         user_repo = PostgresUserRepository(session)
#         tg_id, _ = await send_notification_to_user(session, user_id,
#                                                    "")  # Пустое сообщение, т.к. используем только tg_id
#
#         # Поздравительное сообщение
#         message = "🎉 Поздравляем! Вы завершили все чек-ины за сегодня! Отличная работа! 🚀"
#
#         # URL картинки (можно заменить на свою)
#         photo_url = ABS_IMAGE_PATH
#
#         # Отправляем сообщение с картинкой
#         await bot.send_photo(
#             chat_id=tg_id,
#             photo=photo_url,
#             caption=message,
#             parse_mode="Markdown"
#         )
#     except Exception as e:
#         print(f"Ошибка отправки поздравительного сообщения: {e}")


async def send_notifications():
    while True:
        notifications_to_send = []
        async with session_factory.get_session() as session:
            now = datetime.utcnow().replace(tzinfo=timezone.utc)
            notifications = await session.scalars(
                select(NotificationModel)
                .filter(NotificationModel.status == 'pending')
                .filter(NotificationModel.send_time <= now)
            )

            for notification in notifications:
                try:
                    # Получаем данные пользователя
                    tg_id, message = await send_notification_to_user(session, notification.user_id,
                                                                     notification.message)

                    # Подготовим image_path (если он есть и файл существует)
                    image_path = notification.image_path if notification.image_path and os.path.exists(
                        notification.image_path) else None

                    # Помечаем как отправленное
                    await session.execute(
                        update(NotificationModel)
                        .where(NotificationModel.id == notification.id)
                        .values(status='sent')
                    )

                    notifications_to_send.append((tg_id, message, image_path))
                except Exception as e:
                    print(f"Ошибка обработки {notification.id}: {e}")
                    await session.execute(
                        update(NotificationModel)
                        .where(NotificationModel.id == notification.id)
                        .values(status='failed')
                    )

        # Отправляем уведомления
        for tg_id, message, image_path in notifications_to_send:
            try:
                if image_path:
                    photo = FSInputFile(image_path)  # Используем FSInputFile для файла
                    await bot.send_photo(chat_id=tg_id, photo=photo, caption=message, parse_mode="Markdown")
                else:
                    await bot.send_message(chat_id=tg_id, text=message, parse_mode="Markdown")
            except Exception as e:
                print(f"Ошибка отправки в Telegram для {tg_id}: {e}")

        await asyncio.sleep(300)  # Проверяем каждые 5 минут
