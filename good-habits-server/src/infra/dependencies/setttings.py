from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.settings import PostgresSettingsRepository


async def get_settings_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresSettingsRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresSettingsRepository(session)
