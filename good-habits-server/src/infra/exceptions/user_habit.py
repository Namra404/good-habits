from fastapi import HTTPException


class UserHabitIsAlreadyExist(HTTPException):
    def __init__(self, user_id, habit_id):
        self.user_id = user_id
        self.habit_id = habit_id
        # Передаем статус-код и детальное описание
        detail = f"Progress for user ID {user_id} and habit ID {habit_id} already exists."
        super().__init__(status_code=400, detail=detail)
