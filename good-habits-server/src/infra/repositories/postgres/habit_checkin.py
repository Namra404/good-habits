from dataclasses import dataclass
from datetime import date
from uuid import UUID

from sqlalchemy import insert, update, delete, func, asc
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from src.entity.habit_checkin import HabitCheckIn
from src.infra.repositories.postgres.models import UserHabitProgressModel
from src.infra.repositories.postgres.models.habit_checkin import HabitCheckInModel


@dataclass
class PostgresHabitCheckInRepository:
    session: AsyncSession
    async def get_all(self) -> list[HabitCheckIn]:
        """Получение всех чек-инов."""
        query = select(HabitCheckInModel)
        result = await self.session.execute(query)
        return [check_in.to_entity() for check_in in result.scalars().all()]

    async def get_check_in_by_id(self, check_in_id: UUID) -> HabitCheckIn | None:
        """Получение чек-ина по ID."""
        query = select(HabitCheckInModel).filter_by(id=check_in_id)
        result = await self.session.scalar(query)
        return result.to_entity() if result else None

    async def get_check_ins_by_progress_id(self, progress_id: UUID) -> list[HabitCheckIn]:
        """Получение всех чек-инов по ID прогресса."""
        query = select(HabitCheckInModel).filter_by(progress_id=progress_id)
        result = await self.session.execute(query)
        return [check_in.to_entity() for check_in in result.scalars().all()]

    async def create_bulk_check_ins(self, check_ins: list[HabitCheckIn]) -> list[UUID]:
        """Создание нескольких чек-инов."""
        query = (
            insert(HabitCheckInModel)
            .values(
                [
                    {
                        "id": check_in.id,
                        'title': check_in.title,
                        "progress_id": check_in.progress_id,
                        "check_in_date": check_in.check_in_date,
                        "check_in_number": check_in.check_in_number,
                        "is_completed": check_in.is_completed,
                    }
                    for check_in in check_ins
                ]
            )
            .returning(HabitCheckInModel.id)
        )
        check_in_ids = await self.session.scalars(query)
        await self.session.commit()
        return list(check_in_ids)

    async def create_check_in(self, check_in: HabitCheckIn) -> UUID:
        """Создание нового чек-ина."""
        query = (
            insert(HabitCheckInModel)
            .values(
                id=check_in.id,
                title=check_in.title,
                progress_id=check_in.progress_id,
                check_in_date=check_in.check_in_date,
                check_in_number=check_in.check_in_number,
                is_completed=check_in.is_completed,
            )
            .returning(HabitCheckInModel.id)
        )
        check_in_id = await self.session.scalar(query)
        await self.session.commit()
        return check_in_id

    # async def update_check_in(self, check_in_id: UUID, check_in_data: dict) -> bool:
    #     """Обновление данных чек-ина."""
    #     query = (
    #         update(HabitCheckInModel)
    #         .where(HabitCheckInModel.id == check_in_id)
    #         .values(**check_in_data)
    #     )
    #     result = await self.session.execute(query)
    #     await self.session.commit()
    #     return result.rowcount > 0

    async def update_check_in(self, check_in_id: UUID, check_in_data: dict) -> bool:
        """Обновление данных чек-ина с проверкой прогресса."""
        async with self.session.begin():
            # Выполняем обновление чек-ина
            query = (
                update(HabitCheckInModel)
                .where(HabitCheckInModel.id == check_in_id)
                .values(**check_in_data)
            )
            result = await self.session.execute(query)

            # Если обновление не затронуло строк, возвращаем False
            if result.rowcount == 0:
                return False

            # Проверяем, если статус стал `is_completed = true`
            if check_in_data.get("is_completed"):
                # Получаем информацию о чек-ине и его дате
                check_in_query = (
                    select(HabitCheckInModel)
                    .options(joinedload(HabitCheckInModel.progress))
                    .where(HabitCheckInModel.id == check_in_id)
                )
                check_in = (await self.session.execute(check_in_query)).scalar_one_or_none()

                if not check_in:
                    return False

                check_in_date = check_in.check_in_date
                progress_id = check_in.progress_id

                # Проверяем, есть ли на эту дату другие чек-ины с is_completed = false
                remaining_check_ins_query = (
                    select(func.count())
                    .select_from(HabitCheckInModel)
                    .where(
                        HabitCheckInModel.progress_id == progress_id,
                        HabitCheckInModel.check_in_date == check_in_date,
                        HabitCheckInModel.is_completed == False
                    )
                )
                remaining_check_ins = (await self.session.execute(remaining_check_ins_query)).scalar()

                # Если таких чек-инов больше нет, обновляем completed_days
                if remaining_check_ins == 0:
                    progress_update_query = (
                        update(UserHabitProgressModel)
                        .where(UserHabitProgressModel.id == progress_id)
                        .values(completed_days=UserHabitProgressModel.completed_days + 1)
                    )
                    await self.session.execute(progress_update_query)

            await self.session.commit()
            return True

    async def delete_check_in(self, check_in_id: UUID) -> bool:
        """Удаление чек-ина по ID."""
        query = delete(HabitCheckInModel).where(HabitCheckInModel.id == check_in_id)
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def get_check_ins_by_user_id_and_date(self, user_id: UUID, specific_date: date | None = None) -> list[
        HabitCheckIn]:
        """Получение всех чек-инов пользователя за определенную дату."""
        target_date = specific_date or date.today()
        query = (
            select(HabitCheckInModel)
            .join(UserHabitProgressModel, HabitCheckInModel.progress_id == UserHabitProgressModel.id)
            .filter(
                UserHabitProgressModel.user_id == user_id,
                func.date(HabitCheckInModel.check_in_date) == target_date
            )
            .order_by(
                HabitCheckInModel.check_in_date,
                HabitCheckInModel.check_in_number,
                asc(HabitCheckInModel.is_completed)
            )
        )
        result = await self.session.execute(query)
        return [check_in.to_entity() for check_in in result.scalars().all()]