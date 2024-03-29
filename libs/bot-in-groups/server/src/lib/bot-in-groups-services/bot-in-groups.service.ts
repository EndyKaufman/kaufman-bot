import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';
import { BotInGroupsToolsService } from './bot-in-groups-tools.service';

@Injectable()
export class BotInGroupsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  logger = new Logger(BotInGroupsService.name);

  handlerId = BotInGroupsService.name;

  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly botInGroupsToolsService: BotInGroupsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    if (!this.botCommandsToolsService.isGroupMessage(msg)) {
      return msg;
    }
    if (!this.botCommandsToolsService.isMineMessage(msg)) {
      if (
        this.botInGroupsToolsService.checkPartialContainBotNamesInMessage(
          msg.text,
          msg.locale
        )
      ) {
        msg.text = msg.text
          ? this.botInGroupsToolsService.removePartialAllBotNamesFormMessage(
              msg.text,
              msg.locale
            )
          : undefined;
        if (
          this.botCommandsToolsService.checkCommands(msg.text, [
            BotCommandsEnum.start,
          ])
        ) {
          msg.text = `${this.botInGroupsConfig.name} meet`;
          this.logger.debug(
            `Message from chat to bot: ${msg?.chat?.id}, message: "${msg.text}", callbackQueryData: "${msg.callbackQueryData}"`
          );
        }
      } else {
        msg.handlerStop = true;
        this.logger.debug(`Stop signal from chat to bot`);
      }
    }
    if (
      msg.start ||
      this.botCommandsToolsService.checkCommands(
        this.botInGroupsToolsService.removeAllBotNamesFormMessage<TMsg>(msg),
        [BotCommandsEnum.start]
      )
    ) {
      msg.text = `${this.botInGroupsConfig.name} meet`;
      this.logger.debug(
        `Message from chat to bot: ${msg?.chat?.id}, message: "${msg.text}", callbackQueryData: "${msg.callbackQueryData}"`
      );
    }
    return msg;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.botInGroupsConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (
      this.botCommandsToolsService.checkSpyWords({
        msg,
        spyWords: this.botInGroupsConfig.spyWords,
      })
    ) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          msg.locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale: msg.locale,
            name: this.botInGroupsConfig.title,
            descriptions: this.botInGroupsConfig.descriptions,
            usage: this.botInGroupsConfig.usage,
            category: this.botInGroupsConfig.category,
          }),
        };
      }
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.meet],
          msg.locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.prepareHelpString(
            this.botCommandsToolsService.getRandomItem(
              this.botInGroupsConfig.botMeetingInformation
                ? this.botInGroupsConfig.botMeetingInformation[msg.locale]
                : [
                    getText(`Hello! I'm Robot 😉`),
                    getText('Hello!'),
                    getText('Hello 🖖'),
                  ]
            )
          ),
        };
      }
    }

    return null;
  }
}
