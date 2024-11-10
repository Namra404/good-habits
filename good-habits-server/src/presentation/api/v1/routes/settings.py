from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from src.entity.settings import Settings
from src.infra.dependencies.setttings import get_settings_repository
from src.infra.repositories.postgres.settings import PostgresSettingsRepository

router = APIRouter()


@router.get("/user/{user_id}", response_model=Settings)
async def get_settings_by_user_id(
        user_id: UUID,
        repo: Annotated[PostgresSettingsRepository, Depends(get_settings_repository)]
):
    settings = await repo.get_settings_by_user_id(user_id)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings


@router.post("/", response_model=UUID)
async def create_settings(
        settings: Settings,
        repo: Annotated[PostgresSettingsRepository, Depends(get_settings_repository)]
):
    return await repo.create_settings(settings)


@router.put("/user/{user_id}", response_model=bool)
async def update_settings(
        user_id: UUID, settings_data: dict,
        repo: Annotated[PostgresSettingsRepository, Depends(get_settings_repository)]
):
    return await repo.update_settings(user_id, settings_data)
