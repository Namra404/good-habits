from uuid import UUID

from sqlalchemy import insert

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

    async def create_role(self, role: Role) -> UUID:
        """Создание новой роли."""
        async with self.session_factory.get_session() as session:
            query = (
                insert(RoleModel)
                .values(
                    id=role.id,
                    name=role.name,
                )
                .returning(RoleModel.id)
            )
            role_id = await session.scalar(query)

        return role_id

    async def assign_role_to_user(self, user_id: UUID, role_id: UUID) -> bool:
        """Присвоение роли пользователю."""
        async with self.session_factory.get_session() as session:
            query = (
                insert(RoleModel)
                .values(
                    user_id=user_id,
                    role_id=role_id
                )
            )
            await session.execute(query)
            await session.commit()
            return True
