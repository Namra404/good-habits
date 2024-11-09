from dataclasses import dataclass, field
from uuid import UUID, uuid4


@dataclass(kw_only=True)
class Role:
    id: UUID = field(default_factory=uuid4)
    name: str
