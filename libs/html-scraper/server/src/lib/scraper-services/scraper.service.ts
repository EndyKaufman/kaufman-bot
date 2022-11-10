import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import charset from 'charset';
import cheerio from 'cheerio';
import { getText } from 'class-validator-multi-lang';
import encoding from 'encoding';
import { Context } from 'grammy';
import htmlToText from 'html-to-text';
import jschardet from 'jschardet';
import { render } from 'mustache';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';

@Injectable()
export class ScraperService
  implements BotCommandsProvider, OnContextBotCommands
{
  handlerId = ScraperService.name;

  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('more'), getText('next')],
        locale
      )
    ) {
      msg.text = `${BotCommandsEnum.get} ${this.scraperConfig.name}`;
      return {
        type: 'message',
        message: msg,
      };
    }
    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context,
    loggerContext?: string
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage(
      {
        ...msg,
        text: `${this.scraperConfig.name} ${BotCommandsEnum.help}`,
      },
      ctx,
      loggerContext
    );
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    ctx: Context,
    loggerContext?: string
  ): Promise<BotCommandsProviderActionResultType<TMsg>> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (!locale) {
        throw new Error(`locale not set`);
      }
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale,
            name: this.scraperConfig.title,
            contextUsage: this.scraperConfig.contextUsage,
            descriptions: this.scraperConfig.descriptions,
            usage: this.scraperConfig.usage,
            category: this.scraperConfig.category,
          }),
        };
      }

      const preparedText = this.botCommandsToolsService.clearCommands(
        msg.text,
        [
          spyWord,
          BotCommandsEnum.help,
          ...(this.scraperConfig.removeWords || []),
        ],
        locale
      );
      const replayMessage = await this.scrap(
        locale,
        preparedText,
        loggerContext
      );

      if (replayMessage) {
        return {
          type: 'text',
          message: msg,
          text: replayMessage,
        };
      }

      this.logger.warn(
        `Unhandled commands for text: "${msg.text}", data: "${msg.data}"`,
        loggerContext || ScraperService.name
      );
      this.logger.debug(msg, loggerContext || ScraperService.name);
    }
    return null;
  }

  private async scrap(
    locale: string,
    text: string,
    loggerContext?: string
  ): Promise<string> {
    /*const parsedVariables = parse(this.scraperConfig.uri)
      .filter((arr) => arr[0] === 'name')
      .map((arr) => arr[1]);
    const otherText = text;*/
    const replaceVariables = { text: encodeURIComponent(text.trim()), locale };
    (this.scraperConfig.removeWords || []).forEach((removeWord: string) => {
      text = text
        .replace(new RegExp(removeWord, 'ig'), '')
        .replace(new RegExp(' {2}', 'ig'), ' ')
        .trim();
    });
    const textArray = text.split(' ');
    if (textArray.length > 0) {
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text ${textArrayIndex + 1}`] = textArrayItem;
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`text${textArrayIndex + 1}`] =
          textArrayItem.toLowerCase();
      });
      textArray.forEach((textArrayItem: string, textArrayIndex: number) => {
        replaceVariables[`TEXT${textArrayIndex + 1}`] =
          textArrayItem.toUpperCase();
      });
    }
    const repalcedUri = render(this.scraperConfig.uri, replaceVariables);

    const headers = this.scraperConfig.headers || [
      {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Ch-Ua':
          '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      },
      {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:90.0) Gecko/20100101 Firefox/90.0',
      },
    ];

    const axiosInstance = axios.create({
      timeout: this.scraperConfig.timeout || 3000,
      responseEncoding: this.scraperConfig.contentCodepage || 'binary',
    });

    try {
      const response = await axiosInstance.get(repalcedUri, {
        headers: this.botCommandsToolsService.getRandomItem(headers),
      });
      const $ = cheerio.load(String(response.data));
      let content = this.scraperConfig.contentSelector
        .split(',')
        .map((selector: string) => htmlToText.fromString($(selector).html()))
        .join('\n\n');

      const enc =
        charset(response.headers, response.data) ||
        jschardet.detect(response.data).encoding.toLowerCase();

      if (enc !== 'utf8') {
        content = encoding
          .convert(Buffer.from(content, 'binary'), 'utf8', enc, true)
          .toString('utf8');
      }
      if (!content) {
        this.logger.debug(
          JSON.stringify({
            scraperConfig: this.scraperConfig,
            repalcedUri,
            data: response.data,
            enc,
            selectors: this.scraperConfig.contentSelector,
          })
        );
      }
      return content;
    } catch (err) {
      this.logger.error(err, err.stack, loggerContext || ScraperService.name);
      return err.toString();
    }
  }
}
