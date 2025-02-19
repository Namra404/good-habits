from typing import List, Dict, Any
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, exists
from dataclasses import dataclass
from fastapi import HTTPException
from datetime import date

from src.entity.user_comics import UserComic, UserComicWithDetails
from src.infra.exceptions.user_comics import InsufficientBalanceError
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models import UserModel, ComicModel
from src.infra.repositories.postgres.models.user_comics import UserComicModel


@dataclass
class PostgresUserComicRepository:
    session: AsyncSession

    async def get_user_comics(self, user_id: UUID) -> List[dict[str, Any]]:
        """
        Получение комиксов пользователя с информацией о самих комиксах.
        """
        query = (
            select(
                UserComicModel.id.label("user_comic_id"),
                UserComicModel.user_id,
                UserComicModel.purchase_date,
                ComicModel.id.label("comic_id"),
                ComicModel.title,
                ComicModel.description,
                ComicModel.price,
            )
            .join(ComicModel, UserComicModel.comic_id == ComicModel.id)
            .where(UserComicModel.user_id == user_id)
        )
        result = await self.session.execute(query)

        return [
            {
                "user_comic_id": row.user_comic_id,
                "user_id": row.user_id,
                "purchase_date": row.purchase_date,
                "comic_id": row.comic_id,
                "title": row.title,
                "description": row.description,
                "price": row.price,
            }
            for row in result.all()
        ]

    async def add_user_comic(self, user_comic: UserComic) -> UUID:
        """Добавление нового комикса пользователю с проверкой баланса и проверкой покупки."""

        # Получаем данные пользователя
        user_query = select(UserModel).where(UserModel.id == user_comic.user_id)
        user = (await self.session.execute(user_query)).scalar_one_or_none()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Получаем данные о комиксе
        comic_query = select(ComicModel).where(ComicModel.id == user_comic.comic_id)
        comic = (await self.session.execute(comic_query)).scalar_one_or_none()

        if not comic:
            raise HTTPException(status_code=404, detail="Comic not found")

        # Проверяем, куплен ли уже комикс
        purchase_query = select(exists().where(
            (UserComicModel.user_id == user_comic.user_id) &
            (UserComicModel.comic_id == user_comic.comic_id)
        ))
        is_already_purchased = (await self.session.execute(purchase_query)).scalar()

        if is_already_purchased:
            raise HTTPException(
                status_code=400,
                detail=f"User {user_comic.user_id} has already purchased comic {user_comic.comic_id}."
            )

        # Проверяем баланс
        if user.coin_balance < comic.price:
            raise InsufficientBalanceError(
                user_id=user_comic.user_id,
                required_balance=comic.price,
                current_balance=user.coin_balance
            )

        # Обновляем баланс пользователя
        user.coin_balance -= comic.price

        # Добавляем комикс пользователю
        query = (
            insert(UserComicModel)
            .values(
                id=user_comic.id,
                user_id=user_comic.user_id,
                comic_id=user_comic.comic_id,
                purchase_date=user_comic.purchase_date or date.today(),
            )
            .returning(UserComicModel.id)
        )
        user_comic_id = await self.session.scalar(query)

        await self.session.commit()

        return user_comic_id

    async def user_owns_comic(self, user_id: UUID, comic_id: UUID) -> bool:
        """Проверяет, купил ли пользователь этот комикс."""
        query = select(UserComicModel).filter(
            UserComicModel.user_id == user_id,
            UserComicModel.comic_id == comic_id
        )
        result = await self.session.scalar(query)
        return result is not None