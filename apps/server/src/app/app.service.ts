import {
  BotCommandsProviderActionMsg,
  BotСommandsService,
} from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { Hears, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botСommandsService: BotСommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Welcome'));
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botСommandsService.process(ctx, () => ctx.reply('👍'));
  }

  @Hears('hi')
  async hearsHi(ctx: Context) {
    await this.botСommandsService.process(ctx, () => ctx.reply('Hey there'));
  }

  @On('text')
  async onMessage(ctx) {
    let msg: BotCommandsProviderActionMsg = ctx.update.message;
    const result = await this.botСommandsService.onMessage(msg, ctx);
    if (result?.type === 'message') {
      msg = result.message;
    }
    if (result?.type === 'markdown') {
      await ctx.reply(result.markdown, { parse_mode: 'MarkdownV2' });
      return;
    }
    if (result?.type === 'text') {
      await ctx.reply(result.text);
      return;
    }
  }
}
