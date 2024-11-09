from fastapi import Depends
from collections.abc import AsyncGenerator

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.role import PostgresRoleRepository


async def get_role_repository(session_factory: PostgresSessionFactory = Depends()) -> AsyncGenerator[
    PostgresRoleRepository, None]:
    async with session_factory.get_session() as session:
        yield PostgresRoleRepository(session)
