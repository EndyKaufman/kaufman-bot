import { ConfigMap } from 'kubernetes-types/core/v1';
import {
  APIAI_CLIENT_ACCESS_TOKEN,
  BOT_ADMIN_TELEGRAM_ID,
  BOT_LOCALE,
  BOT_NAME_ALIASES,
  GOOGLE_APIS_API_KEY,
  GOOGLE_APIS_HABR_CUSTOM_SEARCH_ENGINE_ID,
  GOOGLE_APIS_HABR_SEARCH_QUERY_PREFIX,
  GOOGLE_APIS_HABR_SEARCH_SPY_WORDS,
  GOOGLE_APIS_HABR_WHAT_CAN_I_DO_EN,
  GOOGLE_APIS_HABR_WHAT_CAN_I_DO_RU,
  HOST_TYPE,
  MICROSOFT_APP_ID,
  MICROSOFT_APP_PASSWORD,
  PROJECT_NAME,
  ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN,
  ROLLBAR_SERVER_ACCESS_TOKEN,
  SCRAPER_BASHORG_CONTENT_LENGTH,
  SCRAPER_BASHORG_CONTENT_SELECTOR,
  SCRAPER_BASHORG_SPY_WORDS,
  SCRAPER_BASHORG_TIMEOUT,
  SCRAPER_BASHORG_URI,
  SCRAPER_BASHORG_WHAT_CAN_I_DO_EN,
  SCRAPER_BASHORG_WHAT_CAN_I_DO_RU,
  SCRAPER_FORISMATIC_CONTENT_LENGTH,
  SCRAPER_FORISMATIC_CONTENT_SELECTOR,
  SCRAPER_FORISMATIC_SPY_WORDS,
  SCRAPER_FORISMATIC_TIMEOUT,
  SCRAPER_FORISMATIC_URI,
  SCRAPER_FORISMATIC_WHAT_CAN_I_DO_EN,
  SCRAPER_FORISMATIC_WHAT_CAN_I_DO_RU,
  SCRAPER_PING_CONTENT_LENGTH,
  SCRAPER_PING_CONTENT_SELECTOR,
  SCRAPER_PING_SPY_WORDS,
  SCRAPER_PING_TIMEOUT,
  SCRAPER_PING_URI,
  SCRAPER_PING_WHAT_CAN_I_DO_EN,
  SCRAPER_PING_WHAT_CAN_I_DO_RU,
  TELEGRAM_BOT_LOCALE,
  TELEGRAM_BOT_NAME_ALIASES,
  TELEGRAM_HOOK_URL,
  TELEGRAM_TOKEN,
  WIKIPEDIA_CONTENT_LENGTH,
  WIKIPEDIA_SPY_WORDS,
} from '../constants';

export const projectConfigmapYaml = {
  apiVersion: `v1`,
  kind: `ConfigMap`,
  metadata: {
    namespace: `${PROJECT_NAME}-${HOST_TYPE}`,
    name: `${PROJECT_NAME}-config`,
  },
  data: {
    BOT_LOCALE,
    BOT_NAME_ALIASES,
    GOOGLE_APIS_HABR_SEARCH_QUERY_PREFIX,
    GOOGLE_APIS_HABR_SEARCH_SPY_WORDS,
    GOOGLE_APIS_HABR_WHAT_CAN_I_DO_EN,
    GOOGLE_APIS_HABR_WHAT_CAN_I_DO_RU,
    SCRAPER_BASHORG_CONTENT_LENGTH,
    SCRAPER_BASHORG_CONTENT_SELECTOR,
    SCRAPER_BASHORG_SPY_WORDS,
    SCRAPER_BASHORG_TIMEOUT,
    SCRAPER_BASHORG_URI,
    SCRAPER_BASHORG_WHAT_CAN_I_DO_EN,
    SCRAPER_BASHORG_WHAT_CAN_I_DO_RU,
    SCRAPER_FORISMATIC_CONTENT_LENGTH,
    SCRAPER_FORISMATIC_CONTENT_SELECTOR,
    SCRAPER_FORISMATIC_SPY_WORDS,
    SCRAPER_FORISMATIC_TIMEOUT,
    SCRAPER_FORISMATIC_URI,
    SCRAPER_FORISMATIC_WHAT_CAN_I_DO_EN,
    SCRAPER_FORISMATIC_WHAT_CAN_I_DO_RU,
    SCRAPER_PING_CONTENT_LENGTH,
    SCRAPER_PING_CONTENT_SELECTOR,
    SCRAPER_PING_SPY_WORDS,
    SCRAPER_PING_TIMEOUT,
    SCRAPER_PING_URI,
    SCRAPER_PING_WHAT_CAN_I_DO_EN,
    SCRAPER_PING_WHAT_CAN_I_DO_RU,
    TELEGRAM_BOT_LOCALE,
    TELEGRAM_BOT_NAME_ALIASES,
    TELEGRAM_HOOK_URL,
    WIKIPEDIA_CONTENT_LENGTH,
    WIKIPEDIA_SPY_WORDS,

    APIAI_CLIENT_ACCESS_TOKEN,
    BOT_ADMIN_TELEGRAM_ID,
    GOOGLE_APIS_API_KEY,
    GOOGLE_APIS_HABR_CUSTOM_SEARCH_ENGINE_ID,
    MICROSOFT_APP_ID,
    MICROSOFT_APP_PASSWORD,
    ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN,
    ROLLBAR_SERVER_ACCESS_TOKEN,
    TELEGRAM_TOKEN,
  },
} as ConfigMap;
