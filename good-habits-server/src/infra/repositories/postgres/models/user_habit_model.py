from datetime import datetime
from typing import Optional
from uuid import UUID

from src.core.utils import get_utc_now
from src.entity.user_habit_progress import UserHabitProgress
from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship


class UserHabitProgressModel(Base):
    __tablename__ = 'user_habit_progress'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    habit_id: Mapped[UUID] = mapped_column(ForeignKey('habits.id'))
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
    last_check_in_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    checkin_amount_per_day: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str]
    reward_coins: Mapped[int]
    completed_days: Mapped[int] = mapped_column(Integer, default=0)

    check_ins: Mapped[Optional[list['HabitCheckInModel']]] = relationship('HabitCheckInModel',
                                                                          back_populates='progress', uselist=True)

    def to_entity(self) -> UserHabitProgress:
        return UserHabitProgress(
            id=self.id,
            habit_id=self.habit_id,
            user_id=self.user_id,
            start_date=self.start_date,
            last_check_in_date=self.last_check_in_date,
            checkin_amount_per_day = self.checkin_amount_per_day,
            status=self.status,
            reward_coins=self.reward_coins,
            completed_days=self.completed_days,
            check_ins=[check_in.to_entity() for check_in in self.check_ins] if self.check_ins else []
        )
