FROM python:3.11-slim

# Устанавливаем Poetry
RUN pip install --no-cache-dir poetry

# Рабочая директория
WORKDIR /app

# Копируем зависимости
COPY pyproject.toml poetry.lock* ./

# Устанавливаем зависимости (без виртуалки)
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Копируем код приложения
COPY . .

# Запуск произойдёт через docker-compose
