from datetime import datetime
from uuid import UUID

from src.entity.user_habit_progress import UserHabitProgress
from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserHabitProgressModel(Base):
    __tablename__ = 'user_habit_progress'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    habit_id: Mapped[UUID] = mapped_column(ForeignKey('habits.id'))
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    check_in_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[str]
    reward_coins: Mapped[int]

    def to_entity(self) -> UserHabitProgress:
        return UserHabitProgress(
            id=self.id,
            habit_id=self.habit_id,
            user_id=self.user_id,
            start_date=self.start_date,
            check_in_date=self.check_in_date,
            status=self.status,
            reward_coins=self.reward_coins
        )
