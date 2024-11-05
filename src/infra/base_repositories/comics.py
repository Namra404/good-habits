from abc import ABC, abstractmethod
from uuid import UUID

from src.entity.comics import Comic


class BaseComicRepository(ABC):
    @abstractmethod
    async def get_comic_by_id(self, comic_id: UUID) -> Comic | None: ...

    @abstractmethod
    async def create(self, comic: Comic) -> UUID: ...
