from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.core.utils import make_naive
from src.entity.reminder import Reminder
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.reminder import ReminderModel


@dataclass
class PostgresReminderRepository:
    session: AsyncSession

    async def get_reminder_by_id(self, reminder_id: UUID) -> Reminder | None:
        """Получение напоминания по ID."""
        query = select(ReminderModel).filter_by(id=reminder_id)
        result = await self.session.scalar(query)
        return ReminderModel.to_entity(result) if result else None

    async def get_reminders_by_user_id(self, user_id: UUID) -> list[Reminder]:
        """Получение напоминаний пользователя по ID."""
        query = select(ReminderModel).filter_by(user_id=user_id)
        result = await self.session.execute(query)
        return [reminder.to_entity() for reminder in result.scalars().all()]

    async def create_reminder(self, reminder: Reminder) -> UUID:
        """Создание нового напоминания."""
        query = (
            insert(ReminderModel)
            .values(
                id=reminder.id,
                habit_id=reminder.habit_id,
                user_id=reminder.user_id,
                reminder_time=reminder.reminder_time,
                frequency=reminder.frequency,
                deadline_time=reminder.deadline_time,
                notification_text=reminder.notification_text,
                is_active=reminder.is_active,
                last_reminder_date=reminder.last_reminder_date
            )
            .returning(ReminderModel.id)
        )
        reminder_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений
        return reminder_id

    async def update_reminder(self, reminder_id: UUID, reminder_data: dict) -> bool:
        """Обновление данных напоминания."""
        query = (
            update(ReminderModel)
            .where(ReminderModel.id == reminder_id)
            .values(**reminder_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def delete_reminder(self, reminder_id: UUID) -> bool:
        """Удаление напоминания по ID."""
        query = delete(ReminderModel).where(ReminderModel.id == reminder_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0