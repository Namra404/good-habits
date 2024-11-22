from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.habit_checkin import PostgresHabitCheckInRepository
from src.infra.repositories.postgres.factories import PostgresSessionFactory


async def get_habit_checkin_repository(
    session_factory: PostgresSessionFactory = Depends()
) -> AsyncGenerator[PostgresHabitCheckInRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresHabitCheckInRepository(session)
