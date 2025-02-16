from dataclasses import dataclass, field
from enum import Enum
from uuid import UUID, uuid4
from datetime import datetime

from pydantic import BaseModel

from src.entity.habit_checkin import HabitCheckIn


class HabitStatus(str, Enum):
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    PAUSED = "paused"
    FAILED = "failed"


@dataclass(kw_only=True)
class UserHabitProgress:
    id: UUID = field(default_factory=uuid4)
    habit_id: UUID
    user_id: UUID
    start_date: datetime
    last_check_in_date: datetime | None
    checkin_amount_per_day: int | None
    status: HabitStatus
    reward_coins: int
    completed_days: int
    check_ins: list[HabitCheckIn] | None = None
