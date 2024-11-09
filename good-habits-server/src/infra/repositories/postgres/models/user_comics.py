from datetime import datetime
from uuid import UUID

from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.entity.user_comics import UserComic
from src.infra.repositories.postgres.factories import Base


class UserComicModel(Base):
    __tablename__ = 'user_comics'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    comic_id: Mapped[UUID] = mapped_column(ForeignKey('comics.id'))
    purchase_date: Mapped[datetime]

    def to_entity(self) -> UserComic:
        return UserComic(
            id=self.id,
            user_id=self.user_id,
            comic_id=self.comic_id,
            purchase_date=self.purchase_date
        )
