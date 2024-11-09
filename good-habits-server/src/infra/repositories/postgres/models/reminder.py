from datetime import datetime
from uuid import UUID

from src.entity.reminder import Reminder

from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class ReminderModel(Base):
    __tablename__ = 'reminders'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    habit_id: Mapped[UUID] = mapped_column(ForeignKey('habits.id'))
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    reminder_time: Mapped[datetime]
    frequency: Mapped[int]
    deadline_time: Mapped[datetime]
    notification_text: Mapped[str]
    is_active: Mapped[bool]
    last_reminder_date: Mapped[datetime]

    def to_entity(self) -> Reminder:
        return Reminder(
            id=self.id,
            habit_id=self.habit_id,
            user_id=self.user_id,
            reminder_time=self.reminder_time,
            frequency=self.frequency,
            deadline_time=self.deadline_time,
            notification_text=self.notification_text,
            is_active=self.is_active,
            last_reminder_date=self.last_reminder_date
        )
