from abc import ABC, abstractmethod
from uuid import UUID

from src.entity.role import Role


class BaseRoleRepository(ABC):
    @abstractmethod
    async def get_role_by_id(self, role_id: UUID) -> Role | None: ...

    @abstractmethod
    async def create(self, role: Role) -> UUID: ...
