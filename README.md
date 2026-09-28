# UnicornKits — Telegram Mini App

Сине-чёрная витрина автомобильных дисков для запуска внутри Telegram.

## Локальный просмотр

```bash
python3 -m http.server 8080
```

Откройте http://127.0.0.1:8080

## Как подключить к Telegram

1. Создайте бота в [@BotFather](https://t.me/BotFather).
2. Выложите эту папку на HTTPS (GitHub Pages, Cloudflare Pages, Vercel и т.п.).
3. В BotFather: `/newapp` или Menu Button → укажите URL Mini App.
4. Когда пользователь нажимает **Заказать**, Mini App отправляет `sendData` боту.

Пример данных заказа:

```json
{"type":"order","shop":"UnicornKits","product":"disk-01","name":"Диск 01"}
```

## Фото дисков

Положите файлы в `images/` и пропишите пути в `js/catalog.js`. Сейчас в витрине:

- `hre-p201.jpg`
- `hre-p104sc.jpg`
- `work-bst1.jpg`
