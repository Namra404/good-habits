from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from dataclasses import dataclass

from src.entity.reward_history import RewardHistory
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.reward_history import RewardHistoryModel


@dataclass
class PostgresRewardHistoryRepository:
    session_factory: PostgresSessionFactory

    async def get_history_by_user_id(self, user_id: UUID) -> list[RewardHistory]:
        async with self.session_factory.get_session() as session:
            query = select(RewardHistoryModel).filter_by(user_id=user_id)
            result = await session.execute(query)
            return [history.to_entity() for history in result.scalars().all()]

    async def create_history_entry(self, history_entry: RewardHistory) -> UUID:
        async with self.session_factory.get_session() as session:
            query = (
                insert(RewardHistoryModel)
                .values(
                    id=history_entry.id,
                    user_id=history_entry.user_id,
                    coins_changes=history_entry.coins_changes,
                    reward_date=history_entry.reward_date,
                )
                .returning(RewardHistoryModel.id)
            )
            entry_id = await session.scalar(query)
            return entry_id
