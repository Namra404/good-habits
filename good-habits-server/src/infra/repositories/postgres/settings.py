from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update
from dataclasses import dataclass

from src.entity.settings import Settings
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.settings import SettingsModel


@dataclass
class PostgresSettingsRepository:
    session: AsyncSession

    async def get_settings_by_user_id(self, user_id: UUID) -> Settings | None:
        """Получение настроек пользователя по ID."""
        query = select(SettingsModel).filter_by(user_id=user_id)
        result = await self.session.scalar(query)
        return SettingsModel.to_entity(result) if result else None

    async def create_settings(self, settings: Settings) -> UUID:
        """Создание новых настроек."""
        query = (
            insert(SettingsModel)
            .values(
                id=settings.id,
                user_id=settings.user_id,
                timezone=settings.timezone,
                language=settings.language,
            )
            .returning(SettingsModel.id)
        )
        settings_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений
        return settings_id

    async def update_settings(self, user_id: UUID, settings_data: dict) -> bool:
        """Обновление настроек пользователя."""
        query = (
            update(SettingsModel)
            .where(SettingsModel.user_id == user_id)
            .values(**settings_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0