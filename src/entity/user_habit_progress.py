from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime


@dataclass(kw_only=True)
class UserHabitProgress:
    id: UUID = field(default_factory=uuid4)
    habit_id: UUID
    user_id: UUID
    start_date: datetime
    check_in_date: datetime
    status: str
    reward_coins: int
