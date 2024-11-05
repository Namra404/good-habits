from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.user_habit import PostgresUserHabitProgressRepository


async def get_user_habit_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresUserHabitProgressRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresUserHabitProgressRepository(session)
