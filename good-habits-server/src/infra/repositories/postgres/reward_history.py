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
    session: AsyncSession

    async def get_history_by_user_id(self, user_id: UUID) -> list[RewardHistory]:
        """Получение истории наград пользователя по ID."""
        query = select(RewardHistoryModel).filter_by(user_id=user_id)
        result = await self.session.execute(query)
        return [history.to_entity() for history in result.scalars().all()]

    async def create_history_entry(self, history_entry: RewardHistory) -> UUID:
        """Создание записи истории награды."""
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
        entry_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений
        return entry_id
