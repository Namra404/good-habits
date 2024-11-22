from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.dependencies.habit import get_habit_repository
from src.infra.dependencies.habit_checkin import get_habit_checkin_repository
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.habit import PostgresHabitRepository
from src.infra.repositories.postgres.habit_checkin import PostgresHabitCheckInRepository
from src.infra.repositories.postgres.user_habit import PostgresUserHabitProgressRepository


async def get_user_habit_repository(
    habit_repository: PostgresHabitRepository = Depends(get_habit_repository),  # Внедрение зависимости
    habit_check_in_repository: PostgresHabitCheckInRepository = Depends(get_habit_checkin_repository),  # Внедрение зависимости
    session_factory: PostgresSessionFactory = Depends()
) -> AsyncGenerator[PostgresUserHabitProgressRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresUserHabitProgressRepository(
            session, habit_repository, habit_check_in_repository
        )