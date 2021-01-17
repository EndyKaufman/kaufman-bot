import { CommanderStatic, OptionValues } from 'commander';
import { config } from 'dotenv';
import { MicrosoftBotServer } from '../bots/microsoft.bot-server';
import { TelegramBotServer } from '../bots/telegram.bot-server';
import { IBotMessage } from '../lib/interfaces';
import { WebServer } from '../server';
import _ = require('lodash');
import commander = require('commander');
export class App {
  protected program: CommanderStatic;
  protected options: OptionValues;
  protected package: any;
  protected adminTelegramUserId: string;
  protected port: string;
  protected debug: boolean;
  protected rollbarPostServerItemAccessToken: string;
  constructor() {
    config();
    this.adminTelegramUserId = this.env('ADMIN_TELEGRAM_USER_ID');
    this.port = this.env('PORT');
    this.debug = this.env('DEBUG') === 'true';
    this.rollbarPostServerItemAccessToken = this.env('ROLLBAR_POST_SERVER_ITEM_ACCESS_TOKEN');
    this.program = commander;
    this.options = this.program.opts();
    if (this.env('AUTOSTART') === 'true') {
      this.options.start = true;
    }
    this.package = require('../../package.json');
  }
  public env(key: string, defaultValue: any = '') {
    if (process.env[key]) {
      return process.env[key];
    } else {
      return defaultValue;
    }
  }
  public isDebug(msg: IBotMessage): boolean {
    if (_.toString(msg.chat.id) === _.toString(this.adminTelegramUserId) && msg.text && msg.text.toLowerCase().indexOf('debug') !== -1) {
      this.debug = !this.debug;
    }
    return this.debug;
  }
  public initialize() {
    this.program
      .version(this.package.version)
      .option('-s, --start', 'start express server')
      .option('-p, --plugin [plugin]', 'plugin name for start')
      .option('-m, --message [message]', 'input message for plugin')
      .option('-l, --locale [message]', 'set bot language')
      .parse(process.argv);
    let selected = false;
    if (!selected && this.options.plugin) {
      selected = true;
      const telegramBotServer = new TelegramBotServer('TelegramBotServer1');
      const microsoftBotServer = new MicrosoftBotServer('MicrosoftBotServer1');
      telegramBotServer
        .startPlugin(
          this.options.message,
          this.options.plugin === true ? null : this.options.plugin,
          this.options.locale ? this.options.locale : process.env.BOT_LOCALE
        )
        .on('message', (answer: string) => {
          console.log(telegramBotServer.getName() + ': ' + answer);
        });
      microsoftBotServer
        .startPlugin(
          this.options.message,
          this.options.plugin === true ? null : this.options.plugin,
          this.options.locale ? this.options.locale : process.env.BOT_LOCALE
        )
        .on('message', (answer: string) => {
          console.log(microsoftBotServer.getName() + ': ' + answer);
        });
    }
    if (!selected && this.options.start) {
      selected = true;
      const webServer = new WebServer('WebServer1');
      const telegramBotServer = new TelegramBotServer('TelegramBotServer1');
      const microsoftBotServer = new MicrosoftBotServer('MicrosoftBotServer1');
      webServer.start(this.port, this.rollbarPostServerItemAccessToken);
      telegramBotServer.startEndpoint(webServer);
      microsoftBotServer.startEndpoint(webServer);
      telegramBotServer.events.on('customError', (msg: IBotMessage, error: any, stop: boolean = false) => {
        if (!stop) {
          if (msg.originalData) {
            delete msg.originalData;
          }
          telegramBotServer.sendCustomMessage(msg, error, this.adminTelegramUserId);
        }
      });
      telegramBotServer.events.on('message', (msg: IBotMessage, message: string, stop: boolean = false) => {
        if (!stop && message && this.isDebug(msg)) {
          telegramBotServer.sendCustomMessage(msg, message, this.adminTelegramUserId);
        }
      });
      microsoftBotServer.events.on('customError', (msg: IBotMessage, error: any, stop: boolean = false) => {
        if (!stop) {
          telegramBotServer.sendCustomMessage(msg, error, this.adminTelegramUserId, microsoftBotServer.getName());
        }
      });
      microsoftBotServer.events.on('message', (msg: IBotMessage, message: string, stop: boolean = false) => {
        if (!stop && this.debug) {
          telegramBotServer.sendCustomMessage(msg, message, this.adminTelegramUserId, microsoftBotServer.getName());
        }
      });
    }
    if (!selected) {
      selected = true;
      this.program.help();
    }
  }
}
const app = new App();
app.initialize();
