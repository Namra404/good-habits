from uuid import UUID

from src.entity.habit import Habit
from src.infra.repositories.postgres.models.mixins import CreatedUpdatedMixin
from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class HabitModel(CreatedUpdatedMixin, Base):
    __tablename__ = 'habits'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    title: Mapped[str]
    description: Mapped[str]
    duration_days: Mapped[int]
    goal: Mapped[str]

    def to_entity(self) -> Habit:
        return Habit(
            id=self.id,
            user_id=self.user_id,
            title=self.title,
            description=self.description,
            duration_days=self.duration_days,
            goal=self.goal,
        )
