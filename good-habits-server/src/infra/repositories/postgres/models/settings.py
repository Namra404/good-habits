import uuid
from uuid import UUID

from src.entity.settings import Settings

from src.infra.repositories.postgres.models.mixins import CreatedUpdatedMixin
from src.infra.repositories.postgres.factories import Base
from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship


class SettingsModel(CreatedUpdatedMixin, Base):
    __tablename__ = 'settings'
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    timezone: Mapped[str]
    language: Mapped[str]

    def to_entity(self) -> Settings:
        return Settings(
            id=self.id,
            user_id=self.user_id,
            timezone=self.timezone,
            language=self.language,
        )
