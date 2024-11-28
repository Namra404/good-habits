from fastapi import HTTPException


class HabitNotFound(HTTPException):
    def __init__(self, habit_id):
        self.habit_id = habit_id
        # Передаем статус-код 404 и описание ошибки
        detail = f"Habit with ID {habit_id} not found."
        super().__init__(status_code=404, detail=detail)