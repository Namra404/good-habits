from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.entity.comics import Comic
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.comics import ComicModel


@dataclass
class PostgresComicsRepository:
    session: AsyncSession

    async def get_comic_by_id(self, comic_id: UUID) -> Comic | None:
        query = select(ComicModel).filter_by(id=comic_id)
        result = await self.session.scalar(query)
        return ComicModel.to_entity(result) if result else None

    async def create_comic(self, comic: Comic) -> UUID:
        query = (
            insert(ComicModel)
            .values(
                id=comic.id,
                title=comic.title,
                description=comic.description,
                price=comic.price,
            )
            .returning(ComicModel.id)
        )
        comic_id = await self.session.scalar(query)
        return comic_id

    async def update_comic(self, comic_id: UUID, comic_data: dict) -> bool:
        query = (
            update(ComicModel)
            .where(ComicModel.id == comic_id)
            .values(**comic_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount() > 0

    async def delete_comic(self, comic_id: UUID) -> bool:
        query = delete(ComicModel).where(ComicModel.id == comic_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount() > 0
