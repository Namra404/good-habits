from fastapi import FastAPI

from src.presentation.api.v1.routes import comics, reward_history, role, settings, user_comics, user_habit

app = FastAPI()

# Подключаем все маршруты
app.include_router(comics.router, prefix="/comics", tags=["Comics"])
app.include_router(reward_history.router, prefix="/rewards_history", tags=["Rewards History"])
app.include_router(role.router, prefix="/roles", tags=["Roles"])
app.include_router(settings.router, prefix="/settings", tags=["Settings"])
app.include_router(user_comics.router, prefix="/user_comics", tags=["User Comics"])
app.include_router(user_habit.router, prefix="/user_habit_progress", tags=["User Habit"])
