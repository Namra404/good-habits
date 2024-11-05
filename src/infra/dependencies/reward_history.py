from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.reward_history import PostgresRewardHistoryRepository


async def get_reward_history_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresRewardHistoryRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresRewardHistoryRepository(session)
