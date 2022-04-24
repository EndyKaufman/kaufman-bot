# KaufmanBot

Simple bot for telegram

[![NPM version][npm-image]][npm-url]
[![monthly downloads][downloads-image]][downloads-url]
[![Telegram bot][telegram-image]][telegram-url]

## Links

https://github.com/EndyKaufman/kaufman-bot - source code of bot

https://telegram.me/KaufmanBot - current bot in telegram

https://github.com/kaufman-bot/schematics-example - project generated with @kaufman-bot/schematics

# Usage

## Create application

Create empty nx project

> npx -y create-nx-workspace@13.8.1 --name=kaufman-bot-generated --preset=empty --interactive=false --nx-cloud=false

Go to created project

> cd kaufman-bot-generated

Add all need schematics

> npm install -D @nrwl/nest@13.8.1 @kaufman-bot/schematics

Create kaufman-bot application

> npx -y nx@13.8.1 g @kaufman-bot/schematics:app adam-bot --bot-name adam

Create telegram bot in @BotFather
![Create telegram bot in @BotFather](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/y42z7xieyso9vfewdygu.png)

Append token to env file
_.env.local_

```sh
TELEGRAM_BOT_TOKEN=5384981645:AAEKAfqNpZmoN1w5eQL2QxJtvY5h3O-71Zs
TELEGRAM_BOT_WEB_HOOKS_DOMAIN=
TELEGRAM_BOT_WEB_HOOKS_PATH=
TELEGRAM_BOT_ADMINS=
BOT_NAMES=adam
```

Check from telegram

> npm run serve:adam-bot-local

Search new bot
![Search new bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dnxxniwrgixkzxz5wjit.png)

Start work with bot
![Start work with bot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pcqq79odfdja46rtw11r.png)

Example of run commands
![Example of run commands](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/b3vpxtspkdurinm6rp1l.png)

## Create library

Create new command

> npm run nx -- g @kaufman-bot/schematics:lib super
> ![Create new command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/86px1fnvpu6quinjvojy.png)

Update app module

```ts
import { SuperModule } from '@kaufman-bot-generated/super';
...

@Module({
  imports: [
    ...
    SuperModule.forRoot(),
  ],
  providers: [AppService],
})
export class AppModule {}
```

Restart application and check work in telegram
![Restart application and check work in telegram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3w41zhmmq4jayslqphw1.png)

[npm-image]: https://badgen.net/npm/v/@kaufman-bot/core-server
[npm-url]: https://npmjs.org/package/@kaufman-bot/core-server
[telegram-image]: https://img.shields.io/badge/bot-telegram-blue.svg?maxAge=2592000
[telegram-url]: https://t.me/KaufmanBot
[downloads-image]: https://badgen.net/npm/dm/@kaufman-bot/core-server
[downloads-url]: https://npmjs.org/package/@kaufman-bot/core-server

# License

MIT
