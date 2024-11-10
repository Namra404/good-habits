from fastapi import APIRouter, Depends
from typing import List, Annotated
from uuid import UUID

from src.entity.reward_history import RewardHistory
from src.infra.dependencies.reward_history import get_reward_history_repository
from src.infra.repositories.postgres.reward_history import PostgresRewardHistoryRepository

router = APIRouter()


@router.get("/user/{user_id}", response_model=List[RewardHistory])
async def get_history_by_user_id(
        user_id: UUID,
        repo: Annotated[PostgresRewardHistoryRepository, Depends(get_reward_history_repository)]
):
    return await repo.get_history_by_user_id(user_id)


@router.post("/", response_model=UUID)
async def create_history_entry(
        history_entry: RewardHistory,
        repo: Annotated[PostgresRewardHistoryRepository, Depends(get_reward_history_repository)]
):
    return await repo.create_history_entry(history_entry)
