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
    session_factory: PostgresSessionFactory

    async def get_settings_by_user_id(self, user_id: UUID) -> Settings | None:
        async with self.session_factory.get_session() as session:
            query = select(SettingsModel).filter_by(user_id=user_id)
            result = await session.scalar(query)
            return SettingsModel.to_entity(result) if result else None

    async def create_settings(self, settings: Settings) -> UUID:
        async with self.session_factory.get_session() as session:
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
            settings_id = await session.scalar(query)
            return settings_id

    async def update_settings(self, user_id: UUID, settings_data: dict) -> bool:
        async with self.session_factory.get_session() as session:
            query = (
                update(SettingsModel)
                .where(SettingsModel.user_id == user_id)
                .values(**settings_data)
            )
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0
