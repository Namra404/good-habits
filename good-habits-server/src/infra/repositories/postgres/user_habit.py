from datetime import timedelta, datetime
from http.client import HTTPException
from typing import Optional
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update
from dataclasses import dataclass

from sqlalchemy.orm import joinedload

from src.entity.habit_checkin import HabitCheckIn
from src.entity.user_habit_progress import UserHabitProgress
from src.infra.exceptions.habit import HabitNotFound
from src.infra.exceptions.user_habit import UserHabitIsAlreadyExist
from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.habit import PostgresHabitRepository
from src.infra.repositories.postgres.habit_checkin import PostgresHabitCheckInRepository
from src.infra.repositories.postgres.models import HabitModel
from src.infra.repositories.postgres.models.user_habit_model import UserHabitProgressModel


@dataclass
class PostgresUserHabitProgressRepository:
    session: AsyncSession
    habit_repository: PostgresHabitRepository
    habit_check_in_repository: PostgresHabitCheckInRepository

    async def get_all(self) -> list[UserHabitProgress]:
        """Получение всех записей о прогрессе привычек пользователей, включая связанные записи HabitCheckIn."""
        # Загружаем прогресс привычек и связанные записи HabitCheckIn
        query = select(UserHabitProgressModel).options(joinedload(UserHabitProgressModel.check_ins))
        result = await self.session.execute(query)

        # Преобразуем результаты в уникальные модели
        progress_data = result.unique().scalars().all()
        unique_progress_data = list({progress.id: progress for progress in progress_data}.values())
        res = []
        for progress in unique_progress_data:
            res.append(UserHabitProgressModel.to_entity(progress))
        # Преобразуем модели в сущности
        return res

    async def get_habit_progress(self, user_id: UUID, habit_id: UUID) -> Optional[UserHabitProgress]:
        """Получение прогресса привычки пользователя по ID, включая связанные записи HabitCheckIn."""
        query = (
            select(UserHabitProgressModel)
            .filter_by(user_id=user_id, habit_id=habit_id)
            .options(joinedload(UserHabitProgressModel.check_ins))  # Загружаем связанные check-ins
        )
        result = await self.session.scalar(query)

        # Если прогресс найден, возвращаем его, включая связанные HabitCheckIn
        if result:
            return UserHabitProgressModel.to_entity(result)
        return None

    async def update_habit_progress(self, progress_id: UUID, progress_data: UserHabitProgress) -> bool:
        """Обновление прогресса привычки."""
        query = (
            update(UserHabitProgressModel)
            .where(UserHabitProgressModel.id == progress_id)
            .values(**progress_data)
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def create_habit_progress(
            self,
            user_habit: UserHabitProgress
    ) -> UUID:
        """
        Создание прогресса привычки пользователя вместе с необходимыми чек-инами.
        """

        # Проверка существования привычки
        habit = await self.habit_repository.get_habit_by_id(user_habit.habit_id)
        if not habit:
            raise HabitNotFound(habit_id=user_habit.habit_id)

        # Проверка на существование прогресса для этой привычки и пользователя
        existing_progress = await self.get_habit_progress(user_habit.user_id, user_habit.habit_id)
        if existing_progress:
            raise UserHabitIsAlreadyExist(user_id=user_habit.user_id, habit_id=user_habit.habit_id)

        duration_days = habit.duration_days

        # Создание записи прогресса привычки
        progress_id = uuid4()
        progress_query = (
            insert(UserHabitProgressModel)
            .values(
                id=progress_id,
                habit_id=user_habit.habit_id,
                user_id=user_habit.user_id,
                start_date=user_habit.start_date,
                last_check_in_date=None,
                status="in_progress",
                checkin_amount_per_day=user_habit.checkin_amount_per_day,
                reward_coins=user_habit.reward_coins,
                completed_days=0,
            )
        )
        await self.session.execute(progress_query)

        # Генерация чек-инов
        check_ins = []
        for day in range(duration_days):
            day_date = user_habit.start_date + timedelta(days=day)
            for check_in_number in range(1, user_habit.checkin_amount_per_day + 1):
                check_in = HabitCheckIn(
                    title=habit.title,
                    progress_id=progress_id,
                    check_in_date=day_date,
                    check_in_number=check_in_number,
                    is_completed=False,
                )
                check_ins.append(check_in)

        # Создание чек-инов через репозиторий
        await self.habit_check_in_repository.create_bulk_check_ins(check_ins)

        # Подтверждение изменений в базе данных
        await self.session.commit()

        return progress_id