from abc import ABC, abstractmethod
from uuid import UUID

from src.entity.user import User


class BaseUserRepository(ABC):
    @abstractmethod
    async def is_username_exists(self, username: str) -> bool: ...

    @abstractmethod
    async def create(self, user: User) -> UUID: ...

    @abstractmethod
    async def get_user_by_id(self, user_id: UUID) -> User | None: ...

    @abstractmethod
    async def get_user_by_username(self, username: str) -> User | None: ...
