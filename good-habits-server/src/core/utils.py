from datetime import datetime, UTC


def get_utc_now():
    return datetime.now(UTC)


def make_naive(dt_str: str) -> datetime:
    """Преобразует строку даты с часовым поясом в timezone-naive datetime."""
    dt = datetime.fromisoformat(dt_str.replace("Z", "+00:00"))  # Преобразует строку в datetime с учетом UTC
    return dt.replace(tzinfo=None)