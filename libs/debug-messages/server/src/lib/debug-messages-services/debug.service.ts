import { BotCommandsProviderActionMsg } from '@kaufman-bot/core-server';
import { Injectable, Logger } from '@nestjs/common';

const DEBUG_MODE = 'debugMode';

@Injectable()
export class DebugService {
  private readonly logger = new Logger(DebugService.name);

  setDebugMode<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, value: boolean) {
    if (msg) {
      if (!msg.botGlobalContext) {
        msg.botGlobalContext = {};
      }
      msg.botGlobalContext[DEBUG_MODE] = value;
    }
    return msg;
  }

  sendDebugInfo<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(
    msg: TMsg,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    context: string
  ) {
    if (msg?.botGlobalContext?.[DEBUG_MODE]) {
      ctx.reply(
        [
          `*${context} \\(${+new Date()}\\):*`,
          '```',
          JSON.stringify(data, undefined, 4),
          '```',
        ].join('\n'),
        {
          parse_mode: 'MarkdownV2',
        }
      );
      this.logger.debug(data, context);
    }
  }
}
