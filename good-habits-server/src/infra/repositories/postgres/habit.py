from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.entity.habit import Habit
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.habit import HabitModel


@dataclass
class PostgresHabitRepository:
    session: AsyncSession

    async def get_habit_by_id(self, habit_id: UUID) -> Habit | None:
        """Получение привычки по ID."""
        query = select(HabitModel).filter_by(id=habit_id)
        result = await self.session.scalar(query)
        return HabitModel.to_entity(result) if result else None

    async def get_habits_by_user_id(self, user_id: UUID) -> list[Habit]:
        """Получение привычек по ID пользователя."""
        query = select(HabitModel).filter_by(user_id=user_id)
        result = await self.session.execute(query)
        return [habit.to_entity() for habit in result.scalars().all()]

    async def create_habit(self, habit: Habit) -> UUID:
        """Создание новой привычки."""
        query = (
            insert(HabitModel)
            .values(
                id=habit.id,
                user_id=habit.user_id,
                title=habit.title,
                description=habit.description,
                duration_days=habit.duration_days,
                goal=habit.goal,
            )
            .returning(HabitModel.id)
        )
        habit_id = await self.session.scalar(query)
        await self.session.commit()
        return habit_id

    async def update_habit(self, habit_id: UUID, habit_data: dict) -> bool:
        """Обновление данных привычки."""
        query = (
            update(HabitModel)
            .where(HabitModel.id == habit_id)
            .values(**habit_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def delete_habit(self, habit_id: UUID) -> bool:
        """Удаление привычки по ID."""
        query = delete(HabitModel).where(HabitModel.id == habit_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def get_all(self) -> list[Habit]:
        """Получение всех привычек."""
        query = select(HabitModel)
        result = await self.session.scalars(query)
        return [habit.to_entity() for habit in result]