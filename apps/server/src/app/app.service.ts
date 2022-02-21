import { ScraperService } from '@kaufman-bot/plugins/server';
import { Injectable } from '@nestjs/common';
import { Hears, Help, On, Start, Update, Message } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  constructor(private readonly scraperService: ScraperService) {}

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
    const scraperReplayMessage = await this.scraperService.onMessage(msg);
    return scraperReplayMessage;
  }
}
