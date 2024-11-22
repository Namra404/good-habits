from datetime import datetime
from uuid import UUID

from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import Integer, ForeignKey, String, DateTime, Boolean

from src.entity.habit_checkin import HabitCheckIn
from src.infra.repositories.postgres.factories import Base
from src.infra.repositories.postgres.models import UserHabitProgressModel


class HabitCheckInModel(Base):
    __tablename__ = 'habit_check_ins'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    title: Mapped[str]
    progress_id: Mapped[UUID] = mapped_column(ForeignKey('user_habit_progress.id'))
    check_in_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    check_in_number: Mapped[int] = mapped_column(Integer)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    progress: Mapped['UserHabitProgressModel'] = relationship('UserHabitProgressModel', back_populates='check_ins')

    def to_entity(self) -> HabitCheckIn:
        return HabitCheckIn(
            id=self.id,
            title=self.title,
            progress_id=self.progress_id,
            check_in_date=self.check_in_date,
            check_in_number=self.check_in_number,
            is_completed=self.is_completed
        )
