import asyncio
import logging
from datetime import datetime, timedelta, timezone
from sqlalchemy import select, insert, func

from src.infra.repositories.postgres.factories import PostgresSessionFactory
from src.infra.repositories.postgres.models import UserHabitProgressModel
from src.infra.repositories.postgres.models.habit_checkin import HabitCheckInModel
from src.infra.repositories.postgres.models.notification_model import NotificationModel

# Инициализация фабрики сессий
session_factory = PostgresSessionFactory()


logging.basicConfig(level=logging.INFO)


async def schedule_notifications():
    while True:
        async with session_factory.get_session() as session:
            now = datetime.utcnow().replace(tzinfo=timezone.utc)
            logging.info(f"Текущее UTC время: {now}")

            # Получаем активные привычки
            habits = await session.scalars(
                select(UserHabitProgressModel)
                .filter(UserHabitProgressModel.status == 'in_progress')
            )
            habits = list(habits)  # Конвертируем в список для повторного использования
            logging.info(f"Найдено {len(habits)} активных привычек")

            for habit in habits:
                # Получаем чек-ины за сегодня
                check_ins_today = await session.scalars(
                    select(HabitCheckInModel)
                    .filter(
                        HabitCheckInModel.progress_id == habit.id,
                        func.date(HabitCheckInModel.check_in_date) == now.date()
                    )
                )
                check_ins_today = list(check_ins_today)  # Конвертируем в список
                logging.info(f"Привычка {habit.id}: найдено {len(check_ins_today)} чек-инов за сегодня")

                completed_check_ins = [ci for ci in check_ins_today if ci.is_completed]
                pending_check_ins = [ci for ci in check_ins_today if not ci.is_completed]

                logging.info(f"Привычка {habit.id}: {len(completed_check_ins)} завершенных чек-инов, {len(pending_check_ins)} незавершенных")

                for check_in in pending_check_ins:
                    notify_time = check_in.check_in_date - timedelta(hours=1)
                    logging.info(f"Привычка {habit.id}, чек-ин {check_in.id}: время уведомления {notify_time}")

                    # Проверяем, нет ли уже уведомления для этого чек-ина
                    existing = await session.scalar(
                        select(NotificationModel)
                        .filter(NotificationModel.check_in_id == check_in.id)
                    )

                    if existing:
                        logging.info(f"Пропускаем, так как уведомление уже существует для чек-ина {check_in.id}")
                        continue  # Пропускаем существующие уведомления

                    if notify_time <= now:
                        logging.warning(f"Пропускаем, так как время уведомления {notify_time} уже прошло")
                        continue

                    # Вставляем новое уведомление
                    logging.info(f"Создаем уведомление для чек-ина {check_in.id}")

                    await session.execute(
                        insert(NotificationModel).values(
                            user_id=habit.user_id,
                            habit_progress_id=habit.id,
                            check_in_id=check_in.id,
                            send_time=notify_time,  # Теперь зависит от check_in_date
                            status='pending',
                            message=f"Остался час, чтобы отметить привычку! Осталось чек-инов: {habit.checkin_amount_per_day - len(completed_check_ins)}"
                        )
                    )
                    await session.commit()
                    logging.info(f"✅ Уведомление создано для чек-ина {check_in.id}")

        await asyncio.sleep(300)  # Проверяем новые чек-ины каждые 5 минут