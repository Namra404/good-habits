from dataclasses import dataclass, field
from datetime import datetime

from src.core.utils import get_utc_now


@dataclass()
class BaseEntity:
    created_at: datetime = field(default_factory=get_utc_now)
    """Дата создания"""
    updated_at: datetime = field(default_factory=get_utc_now)
    """Дата обновления"""