from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from uuid import UUID

from src.entity.habit import Habit
from src.infra.dependencies.habit import get_habit_repository
from src.infra.repositories.postgres.habit import PostgresHabitRepository

router = APIRouter()


@router.get("/{habit_id}", response_model=Habit)
async def get_habit(
        habit_id: UUID,
        repo: Annotated[PostgresHabitRepository, Depends(get_habit_repository)]
):
    habit = await repo.get_habit_by_id(habit_id)
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.get("/user/{user_id}", response_model=list[Habit])
async def get_habits_by_user(
        user_id: UUID,
        repo: Annotated[PostgresHabitRepository, Depends(get_habit_repository)]
):
    return await repo.get_habits_by_user_id(user_id)


@router.post("/", response_model=UUID)
async def create_habit(
        habit: Habit,
        repo: Annotated[PostgresHabitRepository, Depends(get_habit_repository)]
):
    return await repo.create_habit(habit)


@router.put("/{habit_id}", response_model=bool)
async def update_habit(
        habit_id: UUID,
        habit_data: dict,
        repo: Annotated[PostgresHabitRepository, Depends(get_habit_repository)]
):
    return await repo.update_habit(habit_id, habit_data)


@router.delete("/{habit_id}", response_model=bool)
async def delete_habit(
        habit_id: UUID,
        repo: Annotated[PostgresHabitRepository, Depends(get_habit_repository)]
):
    return await repo.delete_habit(habit_id)
