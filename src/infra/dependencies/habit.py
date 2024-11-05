from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.habit import PostgresHabitRepository


async def get_habit_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresHabitRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresHabitRepository(session)
