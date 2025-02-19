from fastapi import APIRouter, Depends, Header, HTTPException
from typing import List, Annotated
from uuid import UUID

from src.entity.user_comics import UserComic, UserComicWithDetails
from src.infra.dependencies.user_comics import get_user_comics_repository
from src.infra.exceptions.user_comics import InsufficientBalanceError
from src.infra.repositories.postgres.user_comics import PostgresUserComicRepository
from src.presentation.bot.bot_service.comics_service import ComicsService

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


@router.get("/user/comic/owns", response_model=bool)
async def user_owns_comic(
    user_id: Annotated[UUID, Header()],
    comic_id: Annotated[UUID, Header()],
    repo: Annotated[PostgresUserComicRepository, Depends(get_user_comics_repository)]
):
    """Проверяет, купил ли пользователь определённый комикс (параметры передаются в заголовках)."""
    return await repo.user_owns_comic(user_id, comic_id)


@router.post("/send_comic")
async def send_comic(
    user_id: Annotated[UUID, Header()],
    comic_id: Annotated[UUID, Header()],
    repo: PostgresUserComicRepository = Depends(get_user_comics_repository)
):
    """Отправка пользователю ссылки на купленный комикс через Telegram-бота."""
    comics_service = ComicsService(repo.session)  # Используем session из репозитория
    result = await comics_service.send_comic_to_user(user_id, comic_id)

    if result == "Вы не купили этот комикс":
        raise HTTPException(status_code=403, detail=result)
    elif result == "Комикс не найден":
        raise HTTPException(status_code=404, detail=result)
    elif result == "Пользователь не найден":
        raise HTTPException(status_code=404, detail=result)

    return {"message": result}