# Деплой «Феникса» на VPS

На сервере понадобятся Docker Engine с Compose, домен с DNS-записью на IP сервера и TLS-сертификат для этого домена. Откройте порты 80 и 443. Next.js и PostgreSQL доступны внутри сети Compose.

1. Скопируйте `deploy/production.env.example` в `.env.production`, ограничьте доступ к файлу командой `chmod 600 .env.production` и заполните значения. Один и тот же случайный пароль PostgreSQL укажите в обоих полях, например из `openssl rand -hex 32`. Секрет сессии и пароль админки задайте отдельно. Ключ карт подставляется при сборке образа.
2. Создайте `deploy-data/media` и `deploy-data/tls`. Поместите сертификат и ключ в `deploy-data/tls/fullchain.pem` и `deploy-data/tls/privkey.pem`. Сертификат выпускается и обновляется отдельно, например ACME-клиентом с DNS-проверкой. После обновления файлов выполните `docker compose --env-file .env.production -f compose.prod.yaml exec nginx nginx -s reload`.
3. Для переноса скачайте в старой админке **оба** архива: базу и фото/видео. На время создания пары копий приостановите обновление контента. Передайте архивы на VPS по SSH и выполните команды ниже из каталога проекта. Для установки с пустой базой пропустите восстановление базы и распаковку медиа.

```sh
docker compose --env-file .env.production -f compose.prod.yaml up -d --wait postgres
docker compose --env-file .env.production -f compose.prod.yaml build app

# Только для переноса со старой установки, до первого запуска сайта.
# Восстанавливайте в пустую БД; транзакция откатится при ошибке.
docker compose --env-file .env.production -f compose.prod.yaml run --rm -T app \
  sh -c 'pg_restore -d "$DATABASE_URL" --no-owner --no-privileges --single-transaction' < /path/to/fenix.dump
tar -xzf /path/to/fenix-media.tar.gz -C deploy-data/media

# Пользователь node в контейнере имеет UID 1000.
sudo chown -R 1000:1000 deploy-data/media
sudo chmod -R u+rwX,go+rX deploy-data/media

docker compose --env-file .env.production -f compose.prod.yaml run --rm app node scripts/export-review-media.cjs
docker compose --env-file .env.production -f compose.prod.yaml run --rm app npx --no-install prisma migrate deploy
docker compose --env-file .env.production -f compose.prod.yaml up -d
docker compose --env-file .env.production -f compose.prod.yaml exec nginx nginx -t
```

После запуска проверьте главную, админку, обложки статей и перемотку видео. Для существующего видео выполните `curl -sS -D - -o /dev/null -H 'Range: bytes=0-1023' URL` и проверьте ответ `206 Partial Content`.

Nginx читает медиа с диска через внутренний маршрут после проверки публикации или сессии в Next.js. Том подключён к Nginx только для чтения. Фото и видео статей и отзывов отдаются через `sendfile`. Прямой запрос к внутреннему маршруту возвращает 404. Изменение статуса публикации учитывается при каждом новом запросе.

При обновлении установки, где вложения отзывов ещё находятся в PostgreSQL, сначала сохраните дамп базы и остановите старый контейнер `app` командой `docker compose --env-file .env.production -f compose.prod.yaml stop app`. После сборки нового образа выполните экспорт, миграцию и запуск в порядке из примера выше. Экспорт переносит файлы в `deploy-data/media/review-media`, проверяет совпадение байтов и очищает поле в базе. Если экспорт завершился ошибкой, устраните её и повторите экспорт перед запуском миграции.

Для последующих резервных копий выгружайте PostgreSQL из контейнера той же версии и храните дамп и архив медиа вне VPS. Для обновления проекта после загрузки новой версии повторите сборку, миграции и запуск. Том PostgreSQL и каталог медиа переживают пересоздание контейнеров.
