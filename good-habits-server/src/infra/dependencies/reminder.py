from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.reminder import PostgresReminderRepository


async def get_reminder_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresReminderRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresReminderRepository(session)
