import { On, Start, Update } from '@grammyjs/nestjs';
import { BotInGroupsProcessorService } from '@kaufman-bot/bot-in-groups-server';
import { BotCommandsService } from '@kaufman-bot/core-server';
import { Injectable, Logger } from '@nestjs/common';
import { Context } from 'grammy';

@Update()
@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly botCommandsService: BotCommandsService,
    private readonly botInGroupsProcessorService: BotInGroupsProcessorService
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await this.botCommandsService.start(ctx);
  }

  @On(['message', 'callback_query', 'chat_member'])
  async onMessage(ctx: Context) {
    try {
      await this.botInGroupsProcessorService.process(ctx);
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  // @On(['message', 'callback_query', 'chat_member'])
  // async onMessage(ctx: Context) {
  //   try {
  //     await this.botCommandsService.process(ctx);
  //   } catch (err) {
  //     this.logger.error(err, err.stack);
  //   }
  // }
}
