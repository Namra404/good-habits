from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.entity.comics import Comic
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models import UserComicModel
from src.infra.repositories.postgres.models.comics import ComicModel


@dataclass
class PostgresComicsRepository:
    session: AsyncSession

    async def get_all(self) -> list[Comic]:
        """Получение всех комиксов."""
        query = select(ComicModel)
        result = await self.session.scalars(query)
        return [comic.to_entity() for comic in result]

    async def get_comic_by_id(self, comic_id: UUID) -> Comic | None:
        """Получение комикса по ID"""
        query = select(ComicModel).filter_by(id=comic_id)
        result = await self.session.scalar(query)
        return result.to_entity() if result else None

    async def create_comic(self, comic: Comic) -> UUID:
        """Создание нового комикса с ссылкой на Яндекс.Диск."""
        query = (
            insert(ComicModel)
            .values(
                id=comic.id,
                title=comic.title,
                description=comic.description,
                price=comic.price,
                file_url=comic.file_url,
            )
            .returning(ComicModel.id)
        )
        comic_id = await self.session.scalar(query)
        await self.session.commit()
        return comic_id

    async def update_comic(self, comic_id: UUID, comic_data: dict) -> bool:
        """Обновление данных комикса."""
        query = (
            update(ComicModel)
            .where(ComicModel.id == comic_id)
            .values(**comic_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def delete_comic(self, comic_id: UUID) -> bool:
        """Удаление комикса."""
        query = delete(ComicModel).where(ComicModel.id == comic_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0