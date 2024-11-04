from src.entity.role import Role
from src.infra.repositories.postgres.factories import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID


class RoleModel(Base):
    __tablename__ = 'roles'
    id: Mapped[UUID] = mapped_column(primary_key=True)
    name: Mapped[str]

    def to_entity(self) -> Role:
        return Role(
            id=self.id,
            name=self.name
        )
