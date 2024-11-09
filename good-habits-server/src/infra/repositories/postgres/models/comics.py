from uuid import UUID

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.entity.comics import Comic
from src.infra.repositories.postgres.factories import Base


class ComicModel(Base):
    __tablename__ = 'comics'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    title: Mapped[str]
    description: Mapped[str]
    price: Mapped[float]

    def to_entity(self) -> Comic:
        return Comic(
            id=self.id,
            title=self.title,
            description=self.description,
            price=self.price
        )
