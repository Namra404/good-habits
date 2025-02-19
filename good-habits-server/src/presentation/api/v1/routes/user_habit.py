from fastapi import APIRouter, Depends, HTTPException, Query
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


@router.get("/detail/{user_id}/{habit_id}", response_model=dict)
async def get_user_habit_details(
        user_id: UUID,
        habit_id: UUID,
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)]
):
    # Вызов нового метода репозитория
    details = await repo.get_user_habit_detail(user_id, habit_id)
    if not details:
        raise HTTPException(status_code=404, detail="Habit progress not found")
    return details


@router.get("/{user_id}", response_model=list[dict])
async def get_all_user_habits(
        user_id: UUID,
        repo: Annotated[PostgresUserHabitProgressRepository, Depends(get_user_habit_repository)],
        status: str = Query(None, description="Фильтр по статусу привычки (например, 'completed')"),
):
    habits = await repo.get_all_user_habits(user_id, status)
    return habits if habits else []
    # if not habits:
    #     raise HTTPException(status_code=404, detail="No habits found for this user")
    # return habits
