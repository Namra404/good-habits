from uuid import UUID

from sqlalchemy.future import select
from sqlalchemy import insert, update, delete
from dataclasses import dataclass

from src.entity.habit import Habit
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models.habit import HabitModel


@dataclass
class PostgresHabitRepository:
    session_factory: PostgresSessionFactory

    async def get_habit_by_id(self, habit_id: UUID) -> Habit | None:
        async with self.session_factory.get_session() as session:
            query = select(HabitModel).filter_by(id=habit_id)
            result = await session.scalar(query)
            return HabitModel.to_entity(result) if result else None

    async def get_habits_by_user_id(self, user_id: UUID) -> list[Habit]:
        async with self.session_factory.get_session() as session:
            query = select(HabitModel).filter_by(user_id=user_id)
            result = await session.execute(query)
            return [habit.to_entity() for habit in result.scalars().all()]

    async def create_habit(self, habit: Habit) -> UUID:
        async with self.session_factory.get_session() as session:
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
            habit_id = await session.scalar(query)
            return habit_id

    async def update_habit(self, habit_id: UUID, habit_data: dict) -> bool:
        async with self.session_factory.get_session() as session:
            query = (
                update(HabitModel)
                .where(HabitModel.id == habit_id)
                .values(**habit_data)
            )
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0

    async def delete_habit(self, habit_id: UUID) -> bool:
        async with self.session_factory.get_session() as session:
            query = delete(HabitModel).where(HabitModel.id == habit_id)
            result = await session.execute(query)
            await session.commit()
            return result.rowcount > 0
