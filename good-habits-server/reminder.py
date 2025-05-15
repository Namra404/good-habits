# from datetime import datetime, timedelta
#
# # Входные данные
# reminder_time = "08:00"  # Время отправки напоминания, каждый день в 8 утра
# frequency_hours = 12     # Частота отправки, каждые 12 часов
# last_reminder_date = datetime(2024, 11, 3, 8, 0)  # Дата и время последнего напоминания
#
# # Текущее время
# current_time = datetime.now()
#
# # Время последнего напоминания + частота
# next_reminder_time = last_reminder_date + timedelta(hours=frequency_hours)
#
# # Проверка: прошло ли нужное количество времени и совпадает ли текущее время с reminder_time
# if current_time >= next_reminder_time and current_time.time().strftime("%H:%M") == reminder_time:
#     print("Отправить напоминание")
# else:
#     print("Напоминание еще не отправляется")

#
# import asyncio
# import logging
#
# from cian_core.runtime_settings import runtime_settings as settings
# from cian_core.statsd import statsd
# from more_itertools import chunked
#
# from crm_telegram_bot.entities.user import User
# from crm_telegram_bot.enums.reminder import ReminderType
# from crm_telegram_bot.repositories.postgres.reminders import (
#     get_users_ids_for_auth_reminder,
#     get_users_ids_for_marketing_agreement_reminder,
#     get_users_ids_for_setup_search_reminder,
# )
# from crm_telegram_bot.services.tg_bot.reminders.auth import show_auth_reminder
# from crm_telegram_bot.services.tg_bot.reminders.marketing import show_marketing_agreement_reminder
# from crm_telegram_bot.services.tg_bot.reminders.search import show_setup_search_reminder
#
#
# async def send_user_reminders() -> None:
#     for reminder_type in ReminderType:
#         async with asyncio.TaskGroup() as tg:
#             tg.create_task(_process_send_user_reminder(reminder_type))
#
#
# async def _process_send_user_reminder(reminder_type: ReminderType) -> None:
#     match reminder_type:
#         case ReminderType.auth:
#             users_collector_func = get_users_ids_for_auth_reminder
#             users_messaging_func = show_auth_reminder
#         case ReminderType.marketing_agreement:
#             users_collector_func = get_users_ids_for_marketing_agreement_reminder
#             users_messaging_func = show_marketing_agreement_reminder
#         case ReminderType.setup_search:
#             users_collector_func = get_users_ids_for_setup_search_reminder
#             users_messaging_func = show_setup_search_reminder
#         case _:
#             raise ValueError('Unsupported reminder type')
#
#     users_to_send: list[User] = await users_collector_func()
#     statsd.incr(stat=f'reminders.{reminder_type.value}.prepared', count=len(users_to_send))
#
#     for users_batch in chunked(users_to_send, n=settings.CRM_TG_BOT_TELEGRAM_API_RPS):
#         tasks = [users_messaging_func(user) for user in users_batch]
#         results = await asyncio.gather(*tasks, return_exceptions=True)
#
#         failed = [result for result in results if isinstance(result, Exception)]
#         for e in failed:
#             logging.exception('Error when sending reminder: %s', str(e))
#
#         statsd.incr(stat=f'reminders.{reminder_type.value}.sent', count=len(results) - len(failed))
#         statsd.incr(stat=f'reminders.{reminder_type.value}.failed', count=len(failed))
#         await asyncio.sleep(1)
import hmac
import hashlib

bot_token = '7668126732:AAFbK4w1x8zhdr8BDvYaGXduxdIfVOGlSes'

init_data = "query_id=AAEWam0aAAAAABZqbRoSGF7j&user=%7B%22id%22%3A443378198%2C%22first_name%22%3A%22%C2%A9%EF%B8%8F%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22BigC0ck%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FhCI_dCJ-FADsY7bh_bww2c10npqqAkhwi4ex8KCHG4g.svg%22%7D&auth_date=1746449807&signature=txoW4JtxJmv7xcWBmMyLJDEa4nl15rb4sbGSVOkmWnl0KFRHcx6jMG26gRV7stLxIkvcs_D60iI03l6Yj3eJDA&hash=60ea3f5036e062c7dca77e4cc253f8372451453e4efb872691bf7509756ecae6"

def check_telegram_auth(init_data: str, token: str) -> bool:
    params = {}
    for param in init_data.split("&"):
        if "=" in param:
            key, value = param.split("=", 1)
            params[key] = value

    received_hash = params.pop("hash", None)
    params.pop("signature", None)

    if not received_hash:
        print("❌ Hash not found")
        return False

    sorted_items = sorted(params.items())
    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted_items)

    # ✅ ПРАВИЛЬНЫЙ способ создания secret_key
    secret_key = hashlib.sha256(token.encode()).digest()

    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    print("✅ data_check_string:\n", data_check_string)
    print("🔐 computed_hash:", computed_hash)
    print("📦 received_hash:", received_hash)
    print("✅ MATCH:", computed_hash == received_hash)
    return computed_hash == received_hash

check_telegram_auth(init_data, bot_token)
