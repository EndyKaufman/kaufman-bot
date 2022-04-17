import { BotInGroupsProcessorService } from '@kaufman-bot/bot-in-groups-server';
import { BotCommandsService } from '@kaufman-bot/core-server';
import { Injectable, Logger } from '@nestjs/common';
import { On, Start, Update, Use } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly botCommandsService: BotCommandsService,
    private readonly botInGroupsProcessorService: BotInGroupsProcessorService
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await this.botCommandsService.start(ctx);
  }

  @Use()
  async use(ctx) {
    try {
      await this.botInGroupsProcessorService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  @On('sticker')
  async onSticker(ctx) {
    try {
      await this.botCommandsService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  @On('text')
  async onMessage(ctx) {
    try {
      await this.botCommandsService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }
}
