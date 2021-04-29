#!/bin/bash
export DEBUG='false'
export PORT='1105'
export AUTOSTART='false'
export BOT_LOCALE='ru'
export BOT_NAME_ALIASES='kaufman,кауфман,кафман,endy,енди,энди'
export GOOGLE_APIS_HABR_SEARCH_QUERY_PREFIX=''
export GOOGLE_APIS_HABR_SEARCH_SPY_WORDS='habr,habra,хабр,хабра'
export GOOGLE_APIS_HABR_WHAT_CAN_I_DO_EN='I know how to look for information on habrahabr.ru, for example: `habr typescript`'
export GOOGLE_APIS_HABR_WHAT_CAN_I_DO_RU='Умею искать информацию на хабре, пример: `хабра typescript`'
export SCRAPER_BASHORG_CONTENT_LENGTH='5000'
export SCRAPER_BASHORG_CONTENT_SELECTOR='body > div.columns > main > section > article:nth-child(1) > div > div'
export SCRAPER_BASHORG_SPY_WORDS='bash,joke,jokes,баш,шутка,шутки,пошути,шути,шутка,рассмеши,анекдот,смешинки,смешинка,гыгы,haha'
export SCRAPER_BASHORG_TIMEOUT='10000'
export SCRAPER_BASHORG_URI='http://bash.im/random'
export SCRAPER_BASHORG_WHAT_CAN_I_DO_EN='I can joke and tell jokes, for example: `joke`'
export SCRAPER_BASHORG_WHAT_CAN_I_DO_RU='Умею шутить и рассказывать анекдоты, пример: `шутка`'
export SCRAPER_FORISMATIC_CONTENT_LENGTH='4000'
export SCRAPER_FORISMATIC_CONTENT_SELECTOR='body > blockquote > strong > cite,body > blockquote > small'
export SCRAPER_FORISMATIC_SPY_WORDS='quote,quotes,цитата,цитаты,цитируй,умная мысль,цита,мудрость,залечи'
export SCRAPER_FORISMATIC_TIMEOUT='10000'
export SCRAPER_FORISMATIC_URI='https://api.forismatic.com/api/1.0/?method=getQuote&format=html&lang={lang}'
export SCRAPER_FORISMATIC_WHAT_CAN_I_DO_EN='I know how to give random quotes, for example: `quotes`'
export SCRAPER_FORISMATIC_WHAT_CAN_I_DO_RU='Умею выдавать случайные цитаты, пример: `цитаты`'
export SCRAPER_PING_CONTENT_LENGTH='1000'
export SCRAPER_PING_CONTENT_SELECTOR='body > div.wrapper > div.container.content > div.row.margin-bottom-30 > div > div > div > div > div > div.col-md-9 > div > pre'
export SCRAPER_PING_SPY_WORDS='ping,пинг,пинганика'
export SCRAPER_PING_TIMEOUT='10000'
export SCRAPER_PING_URI='http://2whois.ru/?t=ping&data={text}'
export SCRAPER_PING_WHAT_CAN_I_DO_EN='I know how to ping sites, for example: `ping google.com`'
export SCRAPER_PING_WHAT_CAN_I_DO_RU='Умею пинговать сайты, пример: `пинг ya.ru`'
export TELEGRAM_BOT_LOCALE='ru'
export TELEGRAM_BOT_NAME_ALIASES='kaufman,кауфман,кафман,endy,енди,энди'
export TELEGRAM_HOOK_URL='https://kaufman-bot.site15.ru'
export WIKIPEDIA_CONTENT_LENGTH='500'
export WIKIPEDIA_SPY_WORDS='wiki,вики,wikipedia,википедиа'

export PROJECT_NAME='kaufman'
export HOST='localhost'
export HOST_TYPE='prod'
# standard-version: export DOCKER_BOT_IMAGE='localhost:32000/kaufman/bot:$VERSION'
export DOCKER_BOT_IMAGE='localhost:32000/kaufman/bot:1.4.0-alpha.13'
export LETSENCRYPT_EMAIL='admin@site15.ru'
export PROJECT_DOMAIN='kaufman-bot.site15.ru'
export PROJECT_BOT_INGRESS_REWRITE_TARGET='/$1'
export PROJECT_BOT_INGRESS_PATH='/?(.*)'