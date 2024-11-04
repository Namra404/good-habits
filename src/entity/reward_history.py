from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime


@dataclass(kw_only=True)
class RewardHistory:
    id: UUID = field(default_factory=uuid4)
    user_id: UUID
    coins_changes: int
    reward_date: datetime
