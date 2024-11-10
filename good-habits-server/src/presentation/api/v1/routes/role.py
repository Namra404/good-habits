from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from src.entity.role import Role
from src.infra.dependencies.role import get_role_repository
from src.infra.repositories.postgres.role import PostgresRoleRepository

router = APIRouter()


@router.get("/{role_id}", response_model=Role)
async def get_role(
        role_id: UUID,
        repo: Annotated[PostgresRoleRepository, Depends(get_role_repository)]
):
    role = await repo.get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role


@router.post("/", response_model=UUID)
async def create_role(
        role: Role,
        repo: Annotated[PostgresRoleRepository, Depends(get_role_repository)]
):
    """Создание новой роли."""
    return await repo.create_role(role)


@router.post("/assign", response_model=bool)
async def assign_role_to_user(
        user_id: UUID, role_id: UUID,
        repo: Annotated[PostgresRoleRepository, Depends(get_role_repository)]
):
    """Присвоение роли пользователю."""
    success = await repo.assign_role_to_user(user_id, role_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to assign role")
    return success
