from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update
from dataclasses import dataclass

from src.entity.user_habit_progress import UserHabitProgress
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.user_habit_model import UserHabitProgressModel


@dataclass
class PostgresUserHabitProgressRepository:
    session_factory: PostgresSessionFactory

    async def get_habit_progress(self, user_id: UUID, habit_id: UUID) -> UserHabitProgress | None:
        async with self.session_factory.get_session() as session:
            query = select(UserHabitProgressModel).filter_by(user_id=user_id, habit_id=habit_id)
            result = await session.scalar(query)
            return UserHabitProgressModel.to_entity(result) if result else None

    async def create_habit_progress(self, progress: UserHabitProgress) -> UUID:
        async with self.session_factory.get_session() as session:
            query = (
                insert(UserHabitProgressModel)
                .values(
                    id=progress.id,
                    user_id=progress.user_id,
                    habit_id=progress.habit_id,
                    start_date=progress.start_date,
                    check_in_date=progress.check_in_date,
                    status=progress.status,
                    reward_coins=progress.reward_coins,
                )
                .returning(UserHabitProgressModel.id)
            )
            progress_id = await session.scalar(query)
            return progress_id

    async def update_habit_progress(self, progress_id: UUID, progress_data: dict) -> bool:
        async with self.session_factory.get_session() as session:
            query = (
                update(UserHabitProgressModel)
                .where(UserHabitProgressModel.id == progress_id)
                .values(**progress_data)
            )
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0
