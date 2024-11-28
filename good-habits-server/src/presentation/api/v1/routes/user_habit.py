from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from uuid import UUID

from src.entity.user_habit_progress import UserHabitProgress
from src.infra.dependencies.user_habit import get_user_habit_repository
from src.infra.exceptions.user_habit import UserHabitIsAlreadyExist
from src.infra.repositories.postgres.user_habit import PostgresUserHabitProgressRepository

router = APIRouter()


@router.get("/all", response_model=list[UserHabitProgress])
async def get_all_habit_progress(
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)]
):
    """Получение всех записей о прогрессе привычек пользователей."""
    progress = await repo.get_all()
    return progress


@router.get("/{user_id}/{habit_id}", response_model=UserHabitProgress)
async def get_habit_progress(
        user_id: UUID,
        habit_id: UUID,
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)]
):
    progress = await repo.get_habit_progress(user_id, habit_id)
    if not progress:
        raise HTTPException(status_code=404, detail="Habit progress not found")
    return progress


@router.post("/", response_model=UUID)
async def create_habit_progress(
        progress: UserHabitProgress,
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)]
):
    try:
        return await repo.create_habit_progress(progress)
    except UserHabitIsAlreadyExist as e:
        raise HTTPException(status_code=400, detail=e.detail)


@router.put("/{progress_id}", response_model=bool)
async def update_habit_progress(
        progress_id: UUID,
        progress_data: dict,
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)]
):
    return await repo.update_habit_progress(progress_id, progress_data)
