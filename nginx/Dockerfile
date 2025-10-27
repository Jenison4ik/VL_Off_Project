# Базовый образ Nginx
FROM nginx:alpine

# Удаляем стандартный конфиг, чтобы не конфликтовал
RUN rm /etc/nginx/conf.d/default.conf

# Копируем твой полный конфиг nginx.conf в нужное место
COPY nginx.conf /etc/nginx/nginx.conf

# Создаём папку под логи (опционально)
RUN mkdir -p /var/log/nginx

EXPOSE 80