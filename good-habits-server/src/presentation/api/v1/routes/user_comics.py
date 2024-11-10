from fastapi import APIRouter, Depends
from typing import List, Annotated
from uuid import UUID

from src.entity.user_comics import UserComic
from src.infra.dependencies.user_comics import get_user_comics_repository
from src.infra.repositories.postgres.user_comics import PostgresUserComicRepository

router = APIRouter()


@router.get("/user/{user_id}", response_model=List[UserComic])
async def get_user_comics(
        user_id: UUID,
        repo: Annotated[PostgresUserComicRepository, Depends(get_user_comics_repository)]
):
    return await repo.get_user_comics(user_id)


@router.post("/", response_model=UUID)
async def add_user_comic(
        user_comic: UserComic,
        repo: Annotated[PostgresUserComicRepository, Depends(get_user_comics_repository)]
):
    return await repo.add_user_comic(user_comic)
