from sqlalchemy.ext.asyncio import AsyncSession

from src.infra.repositories.postgres.user_comics import PostgresUserComicRepository
from src.presentation.bot.bot_instance import bot
from src.infra.repositories.postgres.comics import PostgresComicsRepository
from src.infra.repositories.postgres.user import PostgresUserRepository
from uuid import UUID


class ComicsService:
    """Сервис для работы с комиксами и отправкой их пользователям через бота."""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_comic_repo = PostgresUserComicRepository(db)
        self.comic_repo = PostgresComicsRepository(db)
        self.user_repo = PostgresUserRepository(db)

    async def send_comic_to_user(self, user_id: UUID, comic_id: UUID) -> str:
        """Отправляет комикс пользователю, если он его купил."""
        # Проверяем, купил ли пользователь этот комикс
        has_comic = await self.user_comic_repo.user_owns_comic(user_id, comic_id)
        if not has_comic:
            return "Вы не купили этот комикс"

        # Получаем данные о комиксе
        comic = await self.comic_repo.get_comic_by_id(comic_id)
        if not comic:
            return "Комикс не найден"

        # Получаем данные о пользователе
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            return "Пользователь не найден"

        # Формируем сообщение
        message_text = (
            f"📖 *Ваш комикс*: {comic.title}\n"
            f"🔗 [Скачать комикс]({comic.file_url})"
        )

        # Отправляем сообщение пользователю через бота
        await bot.send_message(chat_id=user.tg_id, text=message_text, parse_mode="Markdown")

        return "Комикс успешно отправлен"
