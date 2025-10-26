# 1. Базовый образ с Python
FROM python:3.11-slim

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем только requirements для кеша зависимостей
COPY requirements.txt .

# 4. Устанавливаем зависимости (в отдельном слое)
RUN pip install --no-cache-dir -r requirements.txt

# 5. Копируем всё приложение
COPY . .

# 6. Устанавливаем переменную окружения (чтобы Python не кешировал .pyc)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 7. Переходим в директорию, из которой нужно запускать
WORKDIR /app/app

# 8. Команда запуска FastAPI через Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
