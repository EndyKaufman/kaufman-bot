import { Module } from '@nestjs/common';
import { TranslatesModule } from 'nestjs-translates';
import { СommandToolsService } from './command-tools.service';

@Module({
  imports: [TranslatesModule],
  providers: [СommandToolsService],
  exports: [TranslatesModule, СommandToolsService],
})
export class CommandToolsModule {}
