import logging
from dataclasses import dataclass
from datetime import date, timedelta, datetime, timezone
from uuid import UUID

from sqlalchemy import insert, update, delete, func, asc, cast, Date
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from core.utils import make_naive
from src.entity.habit_checkin import HabitCheckIn
from src.infra.repositories.postgres.models import UserHabitProgressModel, NotificationModel
from src.infra.repositories.postgres.models.habit_checkin import HabitCheckInModel
from src.presentation.notification_service.sender import send_congratulatory_message
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

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
    #     """Обновление данных чек-ина с проверкой прогресса и отправкой уведомления."""
    #
    #     if "check_in_date" in check_in_data and isinstance(check_in_data["check_in_date"], str):
    #         check_in_data["check_in_date"] = make_naive(check_in_data["check_in_date"])
    #
    #     async with self.session.begin():
    #         updated_checkin = await self._update_checkin(check_in_id=check_in_id, check_in_data=check_in_data)
    #
    #         if updated_checkin == 0:
    #             return False
    #
    #         if check_in_data.get("is_completed"):
    #             await self._update_checkin_status(check_in_id=check_in_id)
    #
    #         if check_in_data.get("check_in_date"):
    #             if check_in_data.get("check_in_date"):
    #                 await self._update_checkin_time(check_in_id, check_in_data["check_in_date"])
    #     return True
    #
    # async def _update_checkin_time(self, check_in_id: UUID, new_check_in_date: datetime) -> bool:
    #     check_in_query = (
    #         select(NotificationModel)
    #         .where(NotificationModel.check_in_id == check_in_id)
    #     )
    #     result = await self.session.scalar(check_in_query)
    #     if result is None:
    #         return False
    #
    #     query = (
    #         update(NotificationModel)
    #         .where(NotificationModel.check_in_id == check_in_id)
    #         .values(send_time=new_check_in_date - timedelta(hours=1))
    #     )
    #     await self.session.execute(query)
    #
    # async def _update_checkin_status(self, check_in_id: UUID) -> bool:
    #
    #     # Получаем информацию о чек-ине и его дате
    #     check_in_query = (
    #         select(HabitCheckInModel)
    #         .options(joinedload(HabitCheckInModel.progress))
    #         .where(HabitCheckInModel.id == check_in_id)
    #     )
    #     check_in = (await self.session.execute(check_in_query)).scalar_one_or_none()
    #
    #     if not check_in:
    #         return False
    #
    #     check_in_date = check_in.check_in_date
    #     progress_id = check_in.progress_id
    #     user_id = check_in.progress.user_id  # Получаем user_id из прогресса
    #
    #     # Проверяем, есть ли на эту дату другие чек-ины с is_completed = false
    #     remaining_check_ins_query = (
    #         select(func.count())
    #         .select_from(HabitCheckInModel)
    #         .where(
    #             HabitCheckInModel.progress_id == progress_id,
    #             func.date(HabitCheckInModel.check_in_date) == check_in_date.date(),
    #             HabitCheckInModel.is_completed == False
    #         )
    #     )
    #     remaining_check_ins = (await self.session.execute(remaining_check_ins_query)).scalar()
    #
    #     # Если таких чек-инов больше нет
    #     if remaining_check_ins == 0:
    #         # Обновляем completed_days
    #         progress_update_query = (
    #             update(UserHabitProgressModel)
    #             .where(UserHabitProgressModel.id == progress_id)
    #             .values(completed_days=UserHabitProgressModel.completed_days + 1)
    #         )
    #         await self.session.execute(progress_update_query)
    #
    #         # Отправляем уведомление с картинкой
    #         await send_congratulatory_message(self.session, user_id, progress_id)
    #
    # async def _update_checkin(self, check_in_id: UUID, check_in_data: dict):
    #     query = (
    #         update(HabitCheckInModel)
    #         .where(HabitCheckInModel.id == check_in_id)
    #         .values(**check_in_data)
    #     )
    #     return await self.session.execute(query)
    async def update_check_in(self, check_in_id: UUID, check_in_data: dict) -> bool:
        """Обновление данных чек-ина с проверкой прогресса и отправкой уведомления."""

        if "check_in_date" in check_in_data and isinstance(check_in_data["check_in_date"], str):
            check_in_data["check_in_date"] = make_naive(check_in_data["check_in_date"])

        async with self.session.begin():
            updated_checkin = await self._update_checkin(check_in_id=check_in_id, check_in_data=check_in_data)

            if updated_checkin == 0:
                return False

            if check_in_data.get("is_completed"):
                await self._update_checkin_status(check_in_id=check_in_id)

            if check_in_data.get("check_in_date"):
                await self._update_checkin_time(check_in_id, check_in_data["check_in_date"])

        return True

    async def _update_checkin(self, check_in_id: UUID, check_in_data: dict):
        query = (
            update(HabitCheckInModel)
            .where(HabitCheckInModel.id == check_in_id)
            .values(**check_in_data)
        )
        result = await self.session.execute(query)
        return result.rowcount

    async def _update_checkin_time(self, check_in_id: UUID, new_check_in_date: datetime) -> bool:
        check_in_query = (
            select(NotificationModel)
            .where(NotificationModel.check_in_id == check_in_id)
        )
        result = await self.session.scalar(check_in_query)
        if result is None:
            return False

        send_time = new_check_in_date - timedelta(hours=1)
        query = (
            update(NotificationModel)
            .where(NotificationModel.check_in_id == check_in_id)
            .values(send_time=send_time)
        )
        await self.session.execute(query)
        return True

    async def _update_checkin_status(self, check_in_id: UUID) -> bool:
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
        user_id = check_in.progress.user_id

        # Используем UTC-aware дату
        start_dt = datetime.combine(check_in_date.date(), datetime.min.time(), tzinfo=timezone.utc)
        end_dt = start_dt + timedelta(days=1)

        remaining_checkins_query = (
            select(HabitCheckInModel)
            .where(
                HabitCheckInModel.progress_id == progress_id,
                HabitCheckInModel.check_in_date >= start_dt,
                HabitCheckInModel.check_in_date < end_dt,
                HabitCheckInModel.is_completed == False,
                HabitCheckInModel.id != check_in.id
            )
        )
        remaining_checkins = (await self.session.scalars(remaining_checkins_query)).all()

        if not remaining_checkins:
            progress_update_query = (
                update(UserHabitProgressModel)
                .where(UserHabitProgressModel.id == progress_id)
                .values(completed_days=UserHabitProgressModel.completed_days + 1)
            )
            await self.session.execute(progress_update_query)

            await send_congratulatory_message(self.session, user_id, progress_id)

        return True

    async def _update_checkin(self, check_in_id: UUID, check_in_data: dict):
        logger.info(f"_update_checkin: check_in_id={check_in_id}, check_in_data={check_in_data}")
        query = (
            update(HabitCheckInModel)
            .where(HabitCheckInModel.id == check_in_id)
            .values(**check_in_data)
        )
        result = await self.session.execute(query)
        rowcount = result.rowcount
        logger.info(f"Чек-ин обновлён, затронуто строк: {rowcount}")
        return rowcount

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

        # Создаём aware datetime в UTC
        start_dt = datetime.combine(target_date, datetime.min.time(), tzinfo=timezone.utc)
        end_dt = start_dt + timedelta(days=1)

        query = (
            select(HabitCheckInModel)
            .join(UserHabitProgressModel, HabitCheckInModel.progress_id == UserHabitProgressModel.id)
            .filter(
                UserHabitProgressModel.user_id == user_id,
                HabitCheckInModel.check_in_date >= start_dt,
                HabitCheckInModel.check_in_date < end_dt
            )
            .order_by(
                HabitCheckInModel.check_in_date,
                HabitCheckInModel.check_in_number,
                asc(HabitCheckInModel.is_completed)
            )
        )
        result = await self.session.execute(query)
        return [check_in.to_entity() for check_in in result.scalars().all()]