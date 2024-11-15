from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional

from src.entity.base import BaseEntity


@dataclass(kw_only=True)
class User(BaseEntity):
    id: UUID = field(default_factory=uuid4)
    tg_id: int
    role_id: UUID
    username: Optional[str] = None
    coin_balance: int = 0
