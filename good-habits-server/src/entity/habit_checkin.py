from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime


@dataclass(kw_only=True)
class HabitCheckIn:
    id: UUID = field(default_factory=uuid4)
    title: str
    progress_id: UUID
    check_in_date: datetime
    check_in_number: int
    is_completed: bool
