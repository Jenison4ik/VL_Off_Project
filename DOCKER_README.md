# Docker инструкции для Next.js проекта

## Сборка и запуск

### Вариант 1: Использование Docker Compose (рекомендуется)

```bash
# Сборка и запуск
docker-compose up --build

# Запуск в фоновом режиме
docker-compose up -d --build
```

### Вариант 2: Использование Docker напрямую

```bash
# Переход в папку frontend
cd frontend

# Сборка образа
docker build -t vl-off-frontend .

# Запуск контейнера
docker run -p 3000:3000 vl-off-frontend
```

## Доступ к приложению

После запуска приложение будет доступно по адресу: http://localhost:3000

## Остановка

```bash
# Остановка docker-compose
docker-compose down

# Остановка Docker контейнера
docker stop <container_id>
```

## Полезные команды

```bash
# Просмотр логов
docker-compose logs -f

# Пересборка без кэша
docker-compose build --no-cache

# Очистка неиспользуемых образов
docker system prune
```
