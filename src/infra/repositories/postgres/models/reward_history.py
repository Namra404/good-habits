from datetime import datetime
from uuid import UUID

from src.entity.reward_history import RewardHistory
from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class RewardHistoryModel(Base):
    __tablename__ = 'rewards_history'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    coins_changes: Mapped[int]
    reward_date: Mapped[datetime]

    def to_entity(self) -> RewardHistory:
        return RewardHistory(
            id=self.id,
            user_id=self.user_id,
            coins_changes=self.coins_changes,
            reward_date=self.reward_date
        )
