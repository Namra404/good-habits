from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.user_comics import PostgresUserComicRepository


async def get_user_comics_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresUserComicRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresUserComicRepository(session)
