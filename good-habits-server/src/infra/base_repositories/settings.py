from abc import ABC, abstractmethod
from uuid import UUID

from src.entity.settings import Settings


class BaseSettingsRepository(ABC):
    @abstractmethod
    async def get_settings_by_user_id(self, user_id: UUID) -> Settings | None: ...

    @abstractmethod
    async def create(self, settings: Settings) -> UUID: ...
