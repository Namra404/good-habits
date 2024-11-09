from dataclasses import dataclass
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from src.entity.user import User
from src.infra.base_repositories.user import BaseUserRepository
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.user import UserModel


@dataclass
class PostgresUserRepository(BaseUserRepository):

    session_factory: PostgresSessionFactory

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        async with self.session_factory.get_session() as session:
            query = select(UserModel).filter_by(id=user_id)
            result = await session.scalar(query)
            return UserModel.to_entity(result) if result else None

    async def create(self, user: User) -> UUID:
        async with self.session_factory.get_session() as session:
            query = (
                insert(UserModel)
                .values(
                    id=user.id,
                    tg_id=user.tg_id,
                    role_id=user.role_id,
                    username=user.username,
                    coin_balance=user.coin_balance,
                )
                .returning(UserModel.id)
            )
            user_id = await session.scalar(query)
            return user_id

    async def is_username_exists(self, username: str) -> bool:
        async with self.session_factory.get_session() as session:
            query = select(UserModel.id).filter_by(username=username)
            result = await session.scalar(query)
            return result is not None

    async def is_email_exists(self, email: str) -> bool:
        async with self.session_factory.get_session() as session:
            query = select(UserModel.id).filter_by(email=email)
            result = await session.scalar(query)
            return result is not None

    async def get_user_by_username(self, username: str) -> User | None:
        async with self.session_factory.get_session() as session:
            query = select(UserModel).filter_by(username=username)
            result = await session.scalar(query)
            return UserModel.to_entity(result) if result else None
