from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime
from datetime import UTC, datetime


def get_utc_now():
    return datetime.now(UTC)


class CreatedUpdatedMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)
