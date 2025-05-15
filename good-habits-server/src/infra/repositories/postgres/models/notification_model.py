import uuid
from datetime import datetime
from uuid import UUID

from sqlalchemy import Column, String, ForeignKey, DateTime

from sqlalchemy.orm import Mapped, mapped_column

from src.infra.repositories.postgres.factories import Base


class NotificationModel(Base):
    __tablename__ = 'notifications'
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'), nullable=False)
    habit_progress_id: Mapped[UUID] = mapped_column(ForeignKey('user_habit_progress.id'), nullable=False)
    check_in_id: Mapped[UUID] = mapped_column(ForeignKey('habit_check_ins.id'), nullable=True, unique=True)
    send_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default='pending')
    message: Mapped[str] = mapped_column(String, nullable=False)
    image_path: Mapped[str] = mapped_column(String, nullable=True)