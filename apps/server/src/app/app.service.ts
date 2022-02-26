import { CurrencyConverterService } from '@kaufman-bot/currency-converter/server';
import { FactsGeneratorService } from '@kaufman-bot/facts-generator/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, Help, Message, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly currencyConverterService: CurrencyConverterService,
    private readonly factsGeneratorService: FactsGeneratorService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
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
  async onMessage(@Message() msg) {
    try {
      let replayMessage = await this.currencyConverterService.onMessage(msg);
      if (replayMessage === null) {
        replayMessage = this.factsGeneratorService.onMessage(msg);
      }
      return replayMessage;
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
