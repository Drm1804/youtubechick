# youtubchick-bot

Бот для загрузки аудио дорожки из YouTube прямо в Telegram

## Конфигурирование

После клонирования репозитория необходимо скопировать файл `config_template.ts` и переименовать его в `config.ts`

Далее его необходимо заполнить

1. При помощи bot-father создаем или вводим токен суествующего бота

```
  botToken: '',
```

2. Необходимо зарегистрировать свое приложение в Telegram

```
  tlg: {
    apiId: NaN,
    apiHash: ''
  },
```

3. Так же нам потребуется еще один аккаунт, через который бот будет загружать аудио (можно ввести свой).
   При первом запуске бот спросит имя и пароль, если есть 2fa то и проверочный код. Далее в консоль ввыведет суссионую куку. Ее нужно сохранить в конфиг

```
  agent: '',
```

4. По умолчанию бот будет отвечать всем, если вы хотите сделать его приватным, необходимо узнать ID пользователей, которым бот будет доступен. Для этого можно написать любое сообщение боту https://t.me/getmyid_bot
   После чего вписать содержимое user ID в массив (если id несколько писать через запятую):

```
  admins: [XXXXXXX,YYYYYYY]
```

## Деплой на сервер

Необходимо перенести проект на сервер, где вы хотите его запустить (на сервере должен быть установлен Docker). Запустить бота можно при помощи команды

```
docker image build -t ytb -f dockerfile . &&  docker run -it --restart unless-stopped  ytb  node  build/src/main.js
```

## Поддержка и развитие

Если у тебя есть идеи для развития проекта, создавай форк этого репозитори, после чего предлагай в качестве ПР.

Так же ты можешь подписаться на мои социальные сети:

- [yuotube](https://www.youtube.com/channel/UCmGxW0J_DDS3QzPktir5TKw)
- [telegram](https://t.me/alx_four)
