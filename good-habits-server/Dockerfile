#FROM python:3.12-slim
#
## Отключаем создание виртуального окружения
#ENV POETRY_VIRTUALENVS_CREATE=false
#
#WORKDIR /app
#
## Копируем файлы для установки зависимостей
#COPY poetry.lock pyproject.toml ./
#
## Устанавливаем Poetry
#RUN pip install poetry
#
## Устанавливаем зависимости (без установки самого проекта)
#RUN poetry install --no-root --no-interaction --no-ansi
#
## Копируем весь проект
#COPY . .
#
## Указываем команду по умолчанию
#CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
FROM python:3.12-slim

# Отключаем создание виртуального окружения
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

# Копируем файлы для установки зависимостей
COPY poetry.lock pyproject.toml ./

# Устанавливаем Poetry и зависимости
RUN pip install poetry && poetry install --no-root --no-interaction --no-ansi

# Копируем весь проект
COPY . .

# Устанавливаем рабочую директорию
WORKDIR /app

# Команда по умолчанию оставлена для гибкости (можно переопределить в docker-compose)
CMD ["sh", "-c", "echo 'Please specify a command in docker-compose.yml'"]