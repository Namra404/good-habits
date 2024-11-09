from uuid import UUID
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.entity.reminder import Reminder
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.reminder import ReminderModel


@dataclass
class PostgresReminderRepository:
    session_factory: PostgresSessionFactory

    async def get_reminder_by_id(self, reminder_id: UUID) -> Reminder | None:
        async with self.session_factory.get_session() as session:
            query = select(ReminderModel).filter_by(id=reminder_id)
            result = await session.scalar(query)
            return ReminderModel.to_entity(result) if result else None

    async def get_reminders_by_user_id(self, user_id: UUID) -> list[Reminder]:
        async with self.session_factory.get_session() as session:
            query = select(ReminderModel).filter_by(user_id=user_id)
            result = await session.execute(query)
            return [reminder.to_entity() for reminder in result.scalars().all()]

    async def create_reminder(self, reminder: Reminder) -> UUID:
        async with self.session_factory.get_session() as session:
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
            reminder_id = await session.scalar(query)
            return reminder_id

    async def update_reminder(self, reminder_id: UUID, reminder_data: dict) -> bool:
        async with self.session_factory.get_session() as session:
            query = (
                update(ReminderModel)
                .where(ReminderModel.id == reminder_id)
                .values(**reminder_data)
            )
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0

    async def delete_reminder(self, reminder_id: UUID) -> bool:
        async with self.session_factory.get_session() as session:
            query = delete(ReminderModel).where(ReminderModel.id == reminder_id)
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0
