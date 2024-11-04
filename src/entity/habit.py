from dataclasses import dataclass, field
from uuid import UUID, uuid4

from src.entity.base import BaseEntity


@dataclass(kw_only=True)
class Habit(BaseEntity):
    id: UUID = field(default_factory=uuid4)
    user_id: UUID
    title: str
    description: str
    duration_days: int
    goal: str

