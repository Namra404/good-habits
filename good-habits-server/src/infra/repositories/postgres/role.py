from uuid import UUID

from sqlalchemy import insert, update
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.future import select
from dataclasses import dataclass

from src.entity.role import Role
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models import UserModel
from src.infra.repositories.postgres.models.role import RoleModel


@dataclass
class PostgresRoleRepository:
    session: AsyncSession

    async def get_all(self) -> list[Role]:
        """Получение всех ролей."""
        query = select(RoleModel)
        result = await self.session.scalars(query)
        return [role.to_entity() for role in result]

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
            update(UserModel)
            .where(UserModel.id == user_id)
            .values(role_id=role_id)
        )
        result = await self.session.execute(query)

        if result.rowcount == 0:
            raise NoResultFound(f"User with id {user_id} not found.")

        await self.session.commit()
        return True
