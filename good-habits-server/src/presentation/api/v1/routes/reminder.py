from fastapi import APIRouter, Depends, HTTPException
from typing import List, Annotated
from uuid import UUID

from src.entity.reminder import Reminder
from src.infra.dependencies.reminder import get_reminder_repository
from src.infra.repositories.postgres.reminder import PostgresReminderRepository

router = APIRouter()


@router.get("/{reminder_id}", response_model=Reminder)
async def get_reminder(
        reminder_id: UUID,
        repo: Annotated[PostgresReminderRepository, Depends(get_reminder_repository)]
):
    reminder = await repo.get_reminder_by_id(reminder_id)
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")
    return reminder


@router.get("/user/{user_id}", response_model=List[Reminder])
async def get_reminders_by_user_id(
        user_id: UUID,
        repo: Annotated[PostgresReminderRepository, Depends(get_reminder_repository)]
):
    return await repo.get_reminders_by_user_id(user_id)


@router.post("/", response_model=UUID)
async def create_reminder(
        reminder: Reminder,
        repo: Annotated[PostgresReminderRepository, Depends(get_reminder_repository)]
):
    return await repo.create_reminder(reminder)


@router.put("/{reminder_id}", response_model=bool)
async def update_reminder(
        reminder_id: UUID, reminder_data: dict,
        repo: Annotated[PostgresReminderRepository, Depends(get_reminder_repository)]
):
    return await repo.update_reminder(reminder_id, reminder_data)


@router.delete("/{reminder_id}", response_model=bool)
async def delete_reminder(
        reminder_id: UUID,
        repo: Annotated[PostgresReminderRepository, Depends(get_reminder_repository)]
):
    return await repo.delete_reminder(reminder_id)
