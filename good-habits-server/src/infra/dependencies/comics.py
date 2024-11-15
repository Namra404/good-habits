from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.comics import PostgresComicsRepository
from src.infra.repositories.postgres.factories import PostgresSessionFactory


async def get_comics_repository(
    session_factory: PostgresSessionFactory = Depends()
) -> AsyncGenerator[PostgresComicsRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresComicsRepository(session)
