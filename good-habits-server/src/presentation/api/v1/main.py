from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from presentation.api.v1.routes import (user, comics, reward_history, habit, reminder, role, settings, user_comics,
                                            user_habit, habit_checkin, validate)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Замените на ваш фронтенд-URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем все маршруты
app.include_router(comics, prefix="/comics", tags=["Comics"])
app.include_router(reward_history, prefix="/rewards_history", tags=["Rewards History"])
app.include_router(user, prefix="/users", tags=["Users"])
app.include_router(reminder, prefix="/reminders", tags=["Reminders"])
app.include_router(habit, prefix="/habits", tags=["Habits"])
app.include_router(role, prefix="/roles", tags=["Roles"])
app.include_router(settings, prefix="/settings", tags=["Settings"])
app.include_router(user_comics, prefix="/user_comics", tags=["User Comics"])
app.include_router(user_habit, prefix="/user_habit_progress", tags=["User Habit"])
app.include_router(habit_checkin, prefix="/habit_checkin", tags=["Habit Checkins"])
# app.include_router(validate.router, prefix="/validate", tags=["Validate"])
