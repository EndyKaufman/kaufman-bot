import { BotCommandsService } from '@kaufman-bot/core/server';
import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly botCommandsService: BotCommandsService) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botCommandsService.start(ctx);
  }

  @On('sticker')
  async onSticker(ctx) {
    await this.botCommandsService.process(ctx);
  }

  @On('text')
  async onMessage(ctx) {
    await this.botCommandsService.process(ctx);
  }
}
