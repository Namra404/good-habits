from dataclasses import dataclass, field
from uuid import UUID, uuid4


@dataclass(kw_only=True)
class Comic:
    id: UUID = field(default_factory=uuid4)
    title: str
    description: str
    price: float
    file_url: str
