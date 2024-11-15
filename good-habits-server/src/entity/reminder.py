from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import Integer, ForeignKey, String, DateTime


@dataclass(kw_only=True)
class Reminder:
    id: UUID = field(default_factory=uuid4)
    habit_id: UUID
    user_id: UUID
    reminder_time: datetime
    frequency: int
    deadline_time: datetime
    notification_text: str
    is_active: bool
    last_reminder_date: datetime
