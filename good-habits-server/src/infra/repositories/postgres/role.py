from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from dataclasses import dataclass

from src.entity.role import Role
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.role import RoleModel


@dataclass
class PostgresRoleRepository:
    session_factory: PostgresSessionFactory

    async def get_role_by_id(self, role_id: UUID) -> Role | None:
        async with self.session_factory.get_session() as session:
            query = select(RoleModel).filter_by(id=role_id)
            result = await session.scalar(query)
            return RoleModel.to_entity(result) if result else None
