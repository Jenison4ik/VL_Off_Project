FROM nginx:alpine

# Устанавливаем envsubst (если используем переменные окружения)
RUN apk add --no-cache gettext

# Удаляем стандартный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем оба конфига
COPY nginx.conf /etc/nginx/nginx.conf

# Создаём папку под логи и для Certbot
RUN mkdir -p /var/log/nginx /var/www/certbot /etc/letsencrypt

EXPOSE 80 443

# CMD просто старт Nginx, по умолчанию берёт основной конфиг
CMD ["nginx", "-g", "daemon off;"]
