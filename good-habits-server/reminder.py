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
