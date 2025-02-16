from datetime import timedelta, datetime
from fastapi import HTTPException
from typing import Optional
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert, update
from dataclasses import dataclass

from sqlalchemy.orm import joinedload

from src.entity.habit_checkin import HabitCheckIn
from src.entity.user_habit_progress import UserHabitProgress, HabitStatus
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

    async def create_habit_progress(self, user_habit: UserHabitProgress) -> UUID:
        # Проверка существования привычки
        habit = await self.habit_repository.get_habit_by_id(user_habit.habit_id)
        if not habit:
            raise HabitNotFound(habit_id=user_habit.habit_id)

        # Проверка на существование прогресса
        existing_progress = await self.get_habit_progress(user_habit.user_id, user_habit.habit_id)
        if existing_progress:
            raise UserHabitIsAlreadyExist(user_id=user_habit.user_id, habit_id=user_habit.habit_id)

        duration_days = habit.duration_days

        # Убеждаемся, что статус валидный (но это уже проверит Pydantic)
        if user_habit.status not in HabitStatus:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status: {user_habit.status}. Allowed values: {[s.value for s in HabitStatus]}"
            )

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
                status=user_habit.status.value,  # <-- Преобразуем Enum в строку
                checkin_amount_per_day=user_habit.checkin_amount_per_day,
                reward_coins=user_habit.reward_coins,
                completed_days=0,
            )
        )
        await self.session.execute(progress_query)

        # Фиксация изменений в прогрессе
        await self.session.commit()

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

    async def get_user_habit_detail(self, user_id: UUID, habit_id: UUID) -> Optional[dict]:
        """
        Получение детальной информации о прогрессе привычки пользователя, включая данные о самой привычке.
        """
        # Запрос для прогресса привычки
        progress_query = (
            select(UserHabitProgressModel)
            .filter_by(user_id=user_id, habit_id=habit_id)
            .options(joinedload(UserHabitProgressModel.check_ins))  # Загружаем check-ins
        )
        progress_result = await self.session.scalar(progress_query)

        if not progress_result:
            return None

        # Запрос для привычки
        habit_query = select(HabitModel).filter_by(id=habit_id)
        habit_result = await self.session.scalar(habit_query)

        # Формируем JSON-ответ
        progress_json = UserHabitProgressModel.to_entity(progress_result).__dict__
        habit_json = habit_result.to_entity().__dict__ if habit_result else None

        return {
            "progress": progress_json,
            "habit": habit_json
        }

    async def get_all_user_habits(self, user_id: UUID, status: Optional[str] = None) -> list[dict]:
        """
        Получение всех привычек пользователя с их прогрессом.
        Если передан статус, то фильтруем по нему.
        """
        query = select(UserHabitProgressModel).filter(UserHabitProgressModel.user_id == user_id)

        if status:
            query = query.filter(UserHabitProgressModel.status == status)

        query = query.options(joinedload(UserHabitProgressModel.check_ins))
        progress_results = await self.session.scalars(query)
        progress_list = progress_results.unique().all()

        if not progress_list:
            raise HTTPException(
                status_code=404,
                detail=f"No habits found for user {user_id} with status '{status}'" if status else "No habits found for this user"
            )

        habit_ids = [progress.habit_id for progress in progress_list]

        habit_query = select(HabitModel).filter(HabitModel.id.in_(habit_ids))
        habit_results = await self.session.scalars(habit_query)
        habit_list = habit_results.all()

        if not habit_list:
            raise HTTPException(
                status_code=404,
                detail="No associated habits found for this user"
            )

        habits_dict = {habit.id: habit.to_entity().__dict__ for habit in habit_list}

        result = [
            {"progress": progress.to_entity().__dict__, "habit": habits_dict.get(progress.habit_id)}
            for progress in progress_list
        ]

        return result
