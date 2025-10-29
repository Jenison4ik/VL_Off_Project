# Базовый образ Nginx
FROM nginx:alpine

# Устанавливаем утилиту envsubst для подстановки переменных
RUN apk add --no-cache gettext

# Удаляем стандартный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем твой nginx.conf в контейнер
COPY nginx.conf /etc/nginx/nginx.conf

# Создаём папку под логи
RUN mkdir -p /var/log/nginx

EXPOSE 80 443

# При старте контейнера делаем подстановку переменной и запускаем Nginx
CMD /bin/sh -c "envsubst '\$NGINX_DOMAIN' < /etc/nginx/nginx.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
