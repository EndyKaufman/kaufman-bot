import { CurrencyConverterService } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorService } from '@kaufman-bot/facts-generator/server';
import { LanguageSwitherService } from '@kaufman-bot/language-swither/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly currencyConverterService: CurrencyConverterService,
    private readonly factsGeneratorService: FactsGeneratorService,
    private readonly languageSwitherService: LanguageSwitherService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await ctx.reply('Hey there');
  }

  @On('text')
  async onMessage(ctx: Context) {
    try {
      const msg = await this.languageSwitherService.onMessage(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ctx.update as any).message
      );
      let replayMessage;

      if (typeof msg === 'string' || msg?.markdown) {
        replayMessage = msg;
      }

      if (msg.text === '/help') {
        replayMessage = {
          markdown: [
            (await this.languageSwitherService.onHelp(msg)).markdown,
            (await this.currencyConverterService.onHelp(msg)).markdown,
            (await this.factsGeneratorService.onHelp(msg)).markdown,
          ].join('\n\n'),
        };
      }

      if (!replayMessage) {
        replayMessage = await this.currencyConverterService.onMessage(msg);
      }

      if (!replayMessage) {
        replayMessage = await this.factsGeneratorService.onMessage(msg);
      }
      if (replayMessage) {
        if (replayMessage.markdown) {
          ctx.reply(replayMessage.markdown, { parse_mode: 'MarkdownV2' });
        } else {
          ctx.reply(replayMessage);
        }
      }
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
