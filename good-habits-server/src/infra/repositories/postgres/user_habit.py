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
    session: AsyncSession

    async def get_habit_progress(self, user_id: UUID, habit_id: UUID) -> UserHabitProgress | None:
        """Получение прогресса привычки пользователя по ID."""
        query = select(UserHabitProgressModel).filter_by(user_id=user_id, habit_id=habit_id)
        result = await self.session.scalar(query)
        return UserHabitProgressModel.to_entity(result) if result else None

    async def create_habit_progress(self, progress: UserHabitProgress) -> UUID:
        """Создание новой записи о прогрессе привычки."""
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
        progress_id = await self.session.scalar(query)
        await self.session.commit()  # Сохранение изменений
        return progress_id

    async def update_habit_progress(self, progress_id: UUID, progress_data: dict) -> bool:
        """Обновление прогресса привычки."""
        query = (
            update(UserHabitProgressModel)
            .where(UserHabitProgressModel.id == progress_id)
            .values(**progress_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0