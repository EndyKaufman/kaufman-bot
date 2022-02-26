import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import charset from 'charset';
import cheerio from 'cheerio';
import encoding from 'encoding';
import htmlToText from 'html-to-text';
import jschardet from 'jschardet';
import { render } from 'mustache';
import {
  ScraperConfig,
  SCRAPER_CONFIG,
} from '../scraper-config/scraper.config';
import { ScraperCommandsEnum } from '../scraper-types/scraper-commands';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @Inject(SCRAPER_CONFIG)
    private readonly scraperConfig: ScraperConfig
  ) {}

  async onMessage(msg) {
    const locale = msg.from?.language_code || null;
    const spyWord = this.scraperConfig.spyWords.find((spyWord) =>
      msg.text.toLowerCase().includes(spyWord.toLowerCase())
    );
    console.log(spyWord);
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
    console.log(repalcedUri);
    // const replacedText = render(text, replaceVariables);

    // Helper functions to get a random item from an array
    const sample = (array) => array[Math.floor(Math.random() * array.length)];

    const headers = [
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
        headers: sample(headers),
      });

      const $ = cheerio.load(response.data);
      let content = this.scraperConfig.contentSelector
        .split(',')
        .map((selector: string) => htmlToText.fromString($(selector).html()))
        .join('\n\n');

      console.log(response.data);

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
