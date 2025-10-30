# [🌐 VL.RU OFF](https://jenison.ru/) — обновлённый сервис отключений Владивостока

Проект представляет собой редизайн сайта **VL.RU-OFF** — сервиса, который информирует жителей Владивостока об отключениях воды, света и других коммунальных услуг.

Цель проекта — улучшить пользовательский опыт за счёт обновлённого интерфейса, удобной навигации и современной визуальной концепции, сохранив при этом основную функциональность и актуальность данных.

Редизайн включает:
- Переработанную структуру страницы;
- Оптимизацию отображения информации;
- Адаптивный дизайн для корректной работы на всех устройствах.

## Рабочую версию сайта можно посмотреть по ссылке https://jenison.ru

## ⚙️ Структура проекта

Проект состоит из двух основных частей:

| Компонент | Назначение |
|------------|------------|
| **Frontend (Next.js)** | Редизайн главной страницы OFF. Отображение данных и улучшенный пользовательский опыт. |
| **Backend (FastAPI)** | REST API для получения данных об отключениях и адресах, с возможностью фильтрации и поиска. |

## Проект backend`a по basic уровню, представлен в файле [./backend/BACKEND_PROJECT.md](./backend/BACKEND_PROJECT.md)


## 🗃️ ER-диаграмма базы данных

📎 [Посмотреть ER-диаграмму в Google Drive](https://drive.google.com/file/d/1iT7aMqjBba9qrZ3RdFetMKcgEgX2t5OY/view?usp=sharing)

**Основные сущности:**
- `blackouts` — данные об отключениях (тип, описание, инициатор);
- `buildings` — здания и их координаты;
- `blackouts_buildings` — связь "многие ко многим";
- `streets` - названия улиц города. Используется для гибкого поиска
- `districts`, `folk_districts`, `big_folk_districts`, `cities` — справочные таблицы (в проекте не используются).


---

## 🔄 Архитектура взаимодействия

📎 [Визуализация архитектуры (Google Drive)](https://drive.google.com/file/d/17YdZDHXptjGAwLRFEqfNRlobUneIhiCL/view?usp=sharing)


---

## 🚀 Запуск проекта

1. Создаём папку для хранения SSL-сертификатов и ключей вашего домена
```
mkdir ./nginx/certs/conf/live/your_domain.ru
```

2. заменить данные в файле `./nginx/nginx.conf` на свои

3. Создаём самоподписанный SSL-сертификат и приватный ключ
```
openssl req -x509 -nodes -days 365 -newkey rsa:2048   -keyout ./nginx/certs/conf/live/your_domain.ru/privkey.pem   -out ./nginx/certs/conf/live/your_domain.ru/fullchain.pem   -subj "/CN=your_domain.ru"
```
4. Запускаем Certbot в Docker-контейнере, чтобы получить реальный SSL-сертификат для своего домена
```
docker compose run --rm --entrypoint "" certbot \
  certbot certonly --webroot -w /var/www/certbot \
  -d your_domain.ru -d www.your_domain.ru \
  --cert-name your_domain.ru \
  --email youremail@mail.ru --agree-tos --no-eff-email
```

5. Запуск всего проекта
```
docker-compose up --build
```

---

## ❗❗ Важная информация ❗❗

- **База данных:** файл `blackouts.db` необходимо разместить  
  в папке `./backend/app` рядом с `blackouts_database_put_here.lock`.  
  [Скачать базу данных](https://drive.google.com/file/d/193MPUIhWy5sL5yQk7nRSev-IcMimn1bD/view?usp=sharing)

- **Swagger UI** доступен по адресу  
  👉 [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
  при запущенном FastAPI-приложении.  

- **Важно:** запуск FastAPI выполняется из директории  
  `./backend/app`  
  (иначе импорты модулей будут некорректны).  
  [Ссылка на пример launch.json для VSCode](https://drive.google.com/file/d/1xGUZZ8CnAy2rpmZgOotaeIloMpn0cbso/view?usp=sharing)

---



@ Разработано в рамках кейса **VL.RU OFF** — редизайн, переосмысление и расширение функциональности сервиса отключений.