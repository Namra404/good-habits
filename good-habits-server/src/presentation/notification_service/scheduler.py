import asyncio
import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from sqlalchemy import select, insert, func

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models import UserHabitProgressModel
from src.infra.repositories.postgres.models.habit_checkin import HabitCheckInModel
from src.infra.repositories.postgres.models.notification_model import NotificationModel

# Инициализация фабрики сессий
session_factory = PostgresSessionFactory()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DEFAULT_IMAGE_PATH = "src/static/images/angry.png"
SRC_DIR = Path(__file__).resolve().parents[3]
ABS_IMAGE_PATH = str(SRC_DIR / DEFAULT_IMAGE_PATH)

async def schedule_notifications():
    session_factory = PostgresSessionFactory()
    while True:
        async with session_factory.get_session() as session:
            now = datetime.utcnow().replace(tzinfo=timezone.utc)
            logger.info(f"Текущее UTC время: {now}")

            habits = await session.scalars(
                select(UserHabitProgressModel)
                .filter(UserHabitProgressModel.status == 'in_progress')
            )
            habits = list(habits)
            logger.info(f"Найдено {len(habits)} активных привычек")

            for habit in habits:
                start_dt = datetime.combine(now.date(), datetime.min.time(), tzinfo=timezone.utc)
                end_dt = start_dt + timedelta(days=1)

                check_ins_today = await session.scalars(
                    select(HabitCheckInModel)
                    .filter(
                        HabitCheckInModel.progress_id == habit.id,
                        HabitCheckInModel.check_in_date >= start_dt,
                        HabitCheckInModel.check_in_date < end_dt
                    )
                )
                check_ins_today = list(check_ins_today)
                logger.info(f"Привычка {habit.id}: найдено {len(check_ins_today)} чек-инов за сегодня")

                completed_check_ins = [ci for ci in check_ins_today if ci.is_completed]
                pending_check_ins = [ci for ci in check_ins_today if not ci.is_completed]
                logger.info(f"Привычка {habit.id}: {len(completed_check_ins)} завершенных чек-инов, {len(pending_check_ins)} незавершенных")

                for check_in in pending_check_ins:
                    notify_time = check_in.check_in_date - timedelta(hours=1)
                    logger.info(f"Привычка {habit.id}, чек-ин {check_in.id}: время уведомления {notify_time}")

                    existing = await session.scalar(
                        select(NotificationModel).filter(NotificationModel.check_in_id == check_in.id)
                    )

                    if existing:
                        logger.info(f"Пропускаем, уведомление уже существует для чек-ина {check_in.id}")
                        continue

                    if notify_time <= now:
                        logger.warning(f"Пропускаем, время уведомления {notify_time} уже прошло")
                        continue

                    if not os.path.exists(ABS_IMAGE_PATH):
                        logger.error(f"Файл {ABS_IMAGE_PATH} не найден, уведомление не будет создано")
                        continue

                    logger.info(f"Создаем уведомление для чек-ина {check_in.id}, image_path={ABS_IMAGE_PATH}")
                    await session.execute(
                        insert(NotificationModel).values(
                            user_id=habit.user_id,
                            habit_progress_id=habit.id,
                            check_in_id=check_in.id,
                            send_time=notify_time,
                            status='pending',
                            message=f"Остался час, чтобы отметить привычку! Осталось чек-инов: {habit.checkin_amount_per_day - len(completed_check_ins)}",
                            image_path=ABS_IMAGE_PATH
                        )
                    )
                    await session.commit()
                    logger.info(f"✅ Уведомление создано для чек-ина {check_in.id}")

        await asyncio.sleep(300)  # 5 минут
