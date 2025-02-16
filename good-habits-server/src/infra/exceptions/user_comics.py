from uuid import UUID

from fastapi import HTTPException


class InsufficientBalanceError(HTTPException):
    """Кастомное исключение для недостаточного баланса пользователя."""
    def __init__(self, user_id: UUID, required_balance: float, current_balance: float):
        self.user_id = user_id
        self.required_balance = required_balance
        self.current_balance = current_balance
        # Формируем описание ошибки
        detail = (
            f"User with ID {user_id} has insufficient balance. "
            f"Required: {required_balance}, Available: {current_balance}."
        )
        # Передаем статус-код и описание ошибки в родительский класс
        super().__init__(status_code=400, detail=detail)