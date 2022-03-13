import { Module } from '@nestjs/common';
import { TranslatesModule } from 'nestjs-translates';
import { BotСommandsToolsService } from './bot-commands-services/bot-commands-tools.service';
import { BotСommandsService } from './bot-commands-services/bot-commands.service';

@Module({
  imports: [TranslatesModule],
  providers: [BotСommandsToolsService, BotСommandsService],
  exports: [TranslatesModule, BotСommandsToolsService, BotСommandsService],
})
export class BotCommandsModule {}
