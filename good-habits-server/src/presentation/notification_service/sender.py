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

        await asyncio.sleep(10)  # Проверяем каждые 10 секунд


# if __name__ == "__main__":
#     asyncio.run(send_notifications())
