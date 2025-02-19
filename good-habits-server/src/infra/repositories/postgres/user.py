from dataclasses import dataclass
from uuid import UUID
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.basic import BasicRoles
from src.entity.settings import Settings
from src.entity.user import User
from src.infra.base_repositories.user import BaseUserRepository
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.user import UserModel
from src.infra.repositories.postgres.settings import PostgresSettingsRepository


@dataclass
class PostgresUserRepository(BaseUserRepository):
    session: AsyncSession

    async def get_all(self) -> list[User]:
        """Получение всех пользователей."""
        query = select(UserModel)
        result = await self.session.scalars(query)
        return [user.to_entity() for user in result]

    async def get_user_by_id(self, user_id: UUID) -> User | None:
        """Получение пользователя по ID."""
        query = select(UserModel).filter_by(id=user_id)
        result = await self.session.scalar(query)
        return UserModel.to_entity(result) if result else None

    async def create(self, user: User) -> UUID:
        """Создание нового пользователя, если его еще нет."""

        # Проверяем, существует ли пользователь с таким tg_id
        existing_user = await self.get_user_by_tg_id(user.tg_id)
        if existing_user:
            return existing_user.id  # Если пользователь уже есть, возвращаем его ID

        role_id = user.role_id if user.role_id else BasicRoles.USER.value

        # Если пользователя нет, создаем нового
        query = (
            insert(UserModel)
            .values(
                tg_id=user.tg_id,
                role_id=role_id,
                username=user.username,
                coin_balance=0,
                avatar_url=user.avatar_url,
            )
            .returning(UserModel.id)
        )

        try:
            user_id = await self.session.scalar(query)
            await self.session.commit()  # Сохранение изменений

            # **Создание настроек для пользователя**
            settings_repo = PostgresSettingsRepository(self.session)
            new_settings = Settings(
                user_id=user_id,
                timezone="UTC",  # Дефолтный часовой пояс
                language="ru",  # Дефолтный язык
            )
            await settings_repo.create_settings(new_settings)

            return user_id

        except IntegrityError:  # Обработка параллельных регистраций
            await self.session.rollback()
            existing_user = await self.get_user_by_tg_id(user.tg_id)
            return existing_user.id if existing_user else None



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

    async def update(self, user_id: UUID, user_data: dict) -> bool:
        """Обновление пользователя по ID."""
        query = (
            update(UserModel)
            .where(UserModel.id == user_id)
            .values(
                **user_data
            )
        )

        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def get_user_by_tg_id(self, tg_id: int) -> User | None:
        """Получение пользователя по tg_id."""
        query = select(UserModel).filter_by(tg_id=tg_id)
        result = await self.session.scalar(query)
        return UserModel.to_entity(result) if result else None
