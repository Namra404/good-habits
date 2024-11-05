from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.user import PostgresUserRepository


async def get_user_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[PostgresUserRepository, None]:
    async with session_factory.get_session() as session:
        user_repository = PostgresUserRepository(session)
        yield user_repository
