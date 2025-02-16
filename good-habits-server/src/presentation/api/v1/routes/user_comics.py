from fastapi import APIRouter, Depends
from typing import List, Annotated
from uuid import UUID

from src.entity.user_comics import UserComic, UserComicWithDetails
from src.infra.dependencies.user_comics import get_user_comics_repository
from src.infra.exceptions.user_comics import InsufficientBalanceError
from src.infra.repositories.postgres.user_comics import PostgresUserComicRepository

router = APIRouter()


@router.get("/user/{user_id}", response_model=List[UserComicWithDetails])
async def get_user_comics(
        user_id: UUID,
        repo: Annotated[PostgresUserComicRepository, Depends(get_user_comics_repository)]
):
    return await repo.get_user_comics(user_id)


@router.post("/", response_model=UUID)
async def add_user_comic(
    user_comic: UserComic,
    repo: PostgresUserComicRepository = Depends(get_user_comics_repository)
):
    try:
        return await repo.add_user_comic(user_comic)
    except InsufficientBalanceError as e:
        raise e  # Уже содержит HTTPException со статусом и деталями
