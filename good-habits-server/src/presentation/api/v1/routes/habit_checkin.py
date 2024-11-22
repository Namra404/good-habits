from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID
from typing import Annotated

from src.entity.habit_checkin import HabitCheckIn
from src.infra.dependencies.habit_checkin import get_habit_checkin_repository
from src.infra.repositories.postgres.habit_checkin import PostgresHabitCheckInRepository

router = APIRouter()


@router.get("/", response_model=list[HabitCheckIn])
async def get_all_check_ins(
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Получение всех чек-инов."""
    check_ins = await repo.get_all()
    return check_ins


@router.get("/{check_in_id}", response_model=HabitCheckIn)
async def get_check_in(
        check_in_id: UUID,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Получение чек-ина по ID."""
    check_in = await repo.get_check_in_by_id(check_in_id)
    if not check_in:
        raise HTTPException(status_code=404, detail="Habit check-in not found")
    return check_in


@router.get("/progress/{progress_id}", response_model=list[HabitCheckIn])
async def get_check_ins_by_progress(
        progress_id: UUID,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Получение всех чек-инов по прогрессу привычки."""
    check_ins = await repo.get_check_ins_by_progress_id(progress_id)
    if not check_ins:
        raise HTTPException(status_code=404, detail="Habit check-ins not found")
    return check_ins


@router.post("/", response_model=UUID)
async def create_check_in(
        check_in: HabitCheckIn,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Создание нового чек-ина."""
    check_in_id = await repo.create_check_in(check_in)
    return check_in_id


@router.post("/bulk", response_model=int)
async def create_bulk_check_ins(
        check_ins: list[HabitCheckIn],
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Создание нескольких чек-инов."""
    await repo.create_bulk_check_ins(check_ins)
    return len(check_ins)


@router.put("/{check_in_id}", response_model=bool)
async def update_check_in(
        check_in_id: UUID,
        check_in_data: HabitCheckIn,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Обновление данных чек-ина."""
    updated = await repo.update_check_in(check_in_id, check_in_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Habit check-in not found")
    return updated


@router.delete("/{check_in_id}", response_model=bool)
async def delete_check_in(
        check_in_id: UUID,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Удаление чек-ина по ID."""
    deleted = await repo.delete_check_in(check_in_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Habit check-in not found")
    return deleted


@router.get("/today/{user_id}", response_model=list[HabitCheckIn])
async def get_today_check_ins(
        user_id: UUID,
        repo: Annotated[PostgresHabitCheckInRepository, Depends(get_habit_checkin_repository)]
):
    """Получение всех чек-инов пользователя за сегодняшний день."""
    today_check_ins = await repo.get_today_check_ins_by_user_id(user_id)
    if not today_check_ins:
        raise HTTPException(status_code=404, detail="No check-ins found for today")
    return today_check_ins