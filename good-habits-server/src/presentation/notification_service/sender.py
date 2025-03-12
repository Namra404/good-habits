import asyncio
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.notification_model import NotificationModel
from src.infra.repositories.postgres.user import PostgresUserRepository
from src.presentation.bot.bot_instance import bot

# Инициализация фабрики сессий и репозитория

session_factory = PostgresSessionFactory()


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

        # URL картинки (можно заменить на свою)
        photo_url = "https://ir.ozone.ru/s3/multimedia-c/c1000/6064898436.jpg"

        # Отправляем сообщение с картинкой
        await bot.send_photo(
            chat_id=tg_id,
            photo=photo_url,
            caption=message,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка отправки поздравительного сообщения: {e}")


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
                    # Получаем данные пользователя в транзакции
                    tg_id, message = await send_notification_to_user(session, notification.user_id,
                                                                     notification.message)
                    # Помечаем как отправленное до реальной отправки
                    await session.execute(
                        update(NotificationModel)
                        .where(NotificationModel.id == notification.id)
                        .values(status='sent')
                    )
                    notifications_to_send.append((tg_id, message))
                except Exception as e:
                    print(f"Ошибка обработки {notification.id}: {e}")
                    await session.execute(
                        update(NotificationModel)
                        .where(NotificationModel.id == notification.id)
                        .values(status='failed')
                    )

        # Отправляем сообщения вне транзакции
        for tg_id, message in notifications_to_send:
            try:
                await bot.send_message(chat_id=tg_id, text=message, parse_mode="Markdown")
            except Exception as e:
                print(f"Ошибка отправки в Telegram для {tg_id}: {e}")

        await asyncio.sleep(300)  # Проверяем каждые 100 секунд
