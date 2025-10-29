FROM nginx:alpine

# Устанавливаем envsubst
RUN apk add --no-cache gettext

# Удаляем стандартный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем твой nginx.conf
COPY nginx.conf /etc/nginx/start-ssl.conf

# Создаём папку под логи
RUN mkdir -p /var/log/nginx

EXPOSE 80 443

# Подстановка переменной в отдельный файл и запуск Nginx
CMD /bin/sh -c "envsubst '\$NGINX_DOMAIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
