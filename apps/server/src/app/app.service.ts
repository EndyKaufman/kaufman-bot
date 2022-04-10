import { BotСommandsService } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Update } from 'nestjs-telegraf';
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
    await this.botСommandsService.start(ctx);
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botСommandsService.process(ctx);
  }

  @On('text')
  async onMessage(ctx) {
    await this.botСommandsService.process(ctx);
  }
}
