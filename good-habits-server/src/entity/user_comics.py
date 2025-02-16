from dataclasses import dataclass, field
from uuid import UUID, uuid4
from datetime import datetime


@dataclass(kw_only=True)
class UserComic:
    id: UUID = field(default_factory=uuid4)
    user_id: UUID
    comic_id: UUID
    purchase_date: datetime = field(default_factory=datetime.utcnow)


@dataclass(kw_only=True)
class UserComicWithDetails:
    user_comic_id: UUID
    user_id: UUID
    comic_id: UUID
    purchase_date: datetime
    title: str
    description: str
    price: float
