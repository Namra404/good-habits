from uuid import UUID

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update
from dataclasses import dataclass

from src.entity.settings import Settings
from src.infra.exceptions.settings import SettingsAlreadyExist
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
        """Создание новых настроек, если их ещё нет."""
        # Проверка существующих настроек
        existing_settings = await self.get_settings_by_user_id(settings.user_id)
        if existing_settings:
            raise SettingsAlreadyExist(settings.user_id)  # Используем кастомное исключение

        # Попытка создать новые настройки
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
        try:
            settings_id = await self.session.scalar(query)
            await self.session.commit()  # Сохранение изменений
            return settings_id
        except Exception as e:
            await self.session.rollback()
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

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