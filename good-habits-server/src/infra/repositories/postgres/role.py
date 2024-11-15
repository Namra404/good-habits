from uuid import UUID

from sqlalchemy import insert
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.future import select
from dataclasses import dataclass

from src.entity.role import Role
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.role import RoleModel


@dataclass
class PostgresRoleRepository:
    session: AsyncSession

    async def get_role_by_id(self, role_id: UUID) -> Role | None:
        """Получение роли по ID."""
        query = select(RoleModel).filter_by(id=role_id)
        result = await self.session.scalar(query)
        return RoleModel.to_entity(result) if result else None

    async def create_role(self, role: Role) -> UUID:
        """Создание новой роли."""
        query = (
            insert(RoleModel)
            .values(
                id=role.id,
                name=role.name,
            )
            .returning(RoleModel.id)
        )
        role_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений после выполнения запроса
        return role_id

    async def assign_role_to_user(self, user_id: UUID, role_id: UUID) -> bool:
        """Присвоение роли пользователю."""
        query = (
            insert(UserRoleModel)  # Предполагается, что UserRoleModel представляет связь между пользователями и ролями
            .values(
                user_id=user_id,
                role_id=role_id
            )
        )
        await self.session.execute(query)
        await self.session.commit()  # Сохранение изменений после выполнения запроса
        return True
