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
    session: AsyncSession

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        """Получение пользователя по ID."""
        query = select(UserModel).filter_by(id=user_id)
        result = await self.session.scalar(query)
        return UserModel.to_entity(result) if result else None

    async def create(self, user: User) -> UUID:
        """Создание нового пользователя."""
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
        user_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений
        return user_id

    async def is_username_exists(self, username: str) -> bool:
        """Проверка существования имени пользователя."""
        query = select(UserModel.id).filter_by(username=username)
        result = await self.session.scalar(query)
        return result is not None

    async def is_email_exists(self, email: str) -> bool:
        """Проверка существования email."""
        query = select(UserModel.id).filter_by(email=email)
        result = await self.session.scalar(query)
        return result is not None

    async def get_user_by_username(self, username: str) -> User | None:
        """Получение пользователя по имени пользователя."""
        query = select(UserModel).filter_by(username=username)
        result = await self.session.scalar(query)
        return UserModel.to_entity(result) if result else None