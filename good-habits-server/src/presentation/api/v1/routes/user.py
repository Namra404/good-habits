from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated, AsyncGenerator
from uuid import UUID

from src.entity.user import User
from src.infra.dependencies.user import get_user_repository
from src.infra.repositories.postgres.user import PostgresUserRepository

router = APIRouter()


@router.get("/{user_id}", response_model=User)
async def get_user(
        user_id: UUID,
        repo: Annotated[PostgresUserRepository, Depends(get_user_repository)]
):
    user = await repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UUID)
async def create_user(
        user: User,
        repo: Annotated[PostgresUserRepository, Depends(get_user_repository)]
):
    return await repo.create(user)


@router.get("/exists/username/{username}", response_model=bool)
async def is_username_exists(
        username: str,
        repo: Annotated[PostgresUserRepository, Depends(get_user_repository)]
):
    return await repo.is_username_exists(username)


@router.get("/exists/email/{email}", response_model=bool)
async def is_email_exists(
        email: str,
        repo: Annotated[PostgresUserRepository, Depends(get_user_repository)]
):
    return await repo.is_email_exists(email)


@router.get("/username/{username}", response_model=User)
async def get_user_by_username(
        username: str,
        repo: Annotated[PostgresUserRepository, Depends(get_user_repository)]
):
    user = await repo.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
