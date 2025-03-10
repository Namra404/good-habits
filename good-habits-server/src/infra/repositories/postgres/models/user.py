import uuid

from sqlalchemy import Integer, ForeignKey, String, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship

from sqlalchemy.dialects.postgresql import UUID

from src.entity.user import User
from src.infra.repositories.postgres.factories import Base
from src.infra.repositories.postgres.models.mixins import CreatedUpdatedMixin
from src.infra.repositories.postgres.models.role import RoleModel


class UserModel(CreatedUpdatedMixin, Base):
    __tablename__ = 'users'
    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tg_id: Mapped[int] = mapped_column(BigInteger, unique=True)
    role_id: Mapped[UUID] = mapped_column(ForeignKey('roles.id'))
    username: Mapped[str | None] = mapped_column(String, nullable=True)
    coin_balance: Mapped[int] = mapped_column(Integer, default=0)
    avatar_url: Mapped[str | None] = mapped_column(String, nullable=True)

    role: Mapped['RoleModel'] = relationship('RoleModel', lazy='selectin')

    def to_entity(self) -> User:
        role = self.role.to_entity() if self.role else None
        return User(
            id=self.id,
            tg_id=self.tg_id,
            username=self.username,
            role_id=self.role_id,
            coin_balance=self.coin_balance,
            avatar_url=self.avatar_url,
        )