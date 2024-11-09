from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from dataclasses import dataclass

from src.entity.user_comics import UserComic
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.user_comics import UserComicModel


@dataclass
class PostgresUserComicRepository:
    session_factory: PostgresSessionFactory


    async def get_user_comics(self, user_id: UUID) -> list[UserComic]:
        async with self.session_factory.get_session() as session:
            query = select(UserComicModel).filter_by(user_id=user_id)
            result = await session.execute(query)
            return [user_comic.to_entity() for user_comic in result.scalars().all()]

    async def add_user_comic(self, user_comic: UserComic) -> UUID:
        async with self.session_factory.get_session() as session:
            query = (
                insert(UserComicModel)
                .values(
                    id=user_comic.id,
                    user_id=user_comic.user_id,
                    comic_id=user_comic.comic_id,
                    purchase_date=user_comic.purchase_date,
                )
                .returning(UserComicModel.id)
            )
            user_comic_id = await session.scalar(query)
            return user_comic_id
