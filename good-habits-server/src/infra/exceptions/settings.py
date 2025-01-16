from fastapi import HTTPException


class SettingsAlreadyExist(HTTPException):
    def __init__(self, user_id):
        self.user_id = user_id
        # Передаем статус-код 400 и описание ошибки
        detail = f"Settings for user with ID {user_id} already exist."
        super().__init__(status_code=400, detail=detail)