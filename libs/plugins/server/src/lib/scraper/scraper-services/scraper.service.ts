import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import charset from 'charset';
import cheerio from 'cheerio';
import encoding from 'encoding';
import htmlToText from 'html-to-text';
import jschardet from 'jschardet';
import { render } from 'mustache';
import { Message as Msg, On, Update } from 'nestjs-telegraf';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';
import { ScraperCommandsEnum } from '../scraper-types/scraper-commands';

@Update()
@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig
  ) {}

  @On('text')
  async onMessage(@Msg() msg) {
    const locale = msg.from?.language_code || null;
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      msg.text.toLowerCase().includes(spyWord.toLowerCase())
    );
    if (spyWord) {
      if (
        msg.text.includes(`/${ScraperCommandsEnum.help}`) ||
        msg.text.includes(ScraperCommandsEnum.help)
      ) {
        const replayHelpMessage =
          (locale && this.scraperConfig.helpLocale?.[locale]) ||
          this.scraperConfig.help;
        return replayHelpMessage;
      }

      const preparedText = msg.text
        .split(spyWord)
        .join('')
        .split('  ')
        .join('')
        .trim();

      const replayMessage = await this.scrap(locale, preparedText);

      if (replayMessage) {
        return replayMessage;
      }

      this.logger.warn(`Unhandled commands for text: "${msg.text}"`);
      this.logger.debug(msg);
    }
    return null;
  }

  private async scrap(locale: string, text: string) {
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
    // const replacedText = render(text, replaceVariables);

    const axiosInstance = axios.create({
      timeout: this.scraperConfig.timeout,
      responseEncoding: this.scraperConfig.contentCodepage || 'binary',
    });

    try {
      const response = await axiosInstance.get(repalcedUri);
      const $ = cheerio.load(response.data);
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
      return content;
    } catch (err) {
      this.logger.error(err, err.stack);
      return err.toString();
    }
  }
}