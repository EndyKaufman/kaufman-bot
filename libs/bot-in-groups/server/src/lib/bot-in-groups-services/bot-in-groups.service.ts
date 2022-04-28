import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnBeforeBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import {
  BotInGroupsConfig,
  BOT_IN_GROUPS_CONFIG,
} from '../bot-in-groups-config/bot-in-groups.config';

@Injectable()
export class BotInGroupsService
  implements BotCommandsProvider, OnBeforeBotCommands
{
  constructor(
    @Inject(BOT_IN_GROUPS_CONFIG)
    private readonly botInGroupsConfig: BotInGroupsConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService
  ) {}

  async onBeforeBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<TMsg> {
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');
    if (msg?.from?.id !== msg?.chat?.id) {
      if (
        this.botCommandsToolsService.checkCommands(msg.text, [
          ...this.botInGroupsConfig.botNames[locale],
          ...this.botInGroupsConfig.botNames['en'],
        ])
      ) {
        msg.text = this.botCommandsToolsService.clearCommands(
          msg.text,
          [
            ...this.botInGroupsConfig.botNames[locale],
            ...this.botInGroupsConfig.botNames['en'],
          ],
          locale
        );
        if (
          this.botCommandsToolsService.checkCommands(
            this.botCommandsToolsService.clearCommands(
              msg.text,
              [
                ...this.botInGroupsConfig.botNames[locale],
                ...this.botInGroupsConfig.botNames['en'],
              ],
              locale
            ),
            ['start']
          )
        ) {
          msg.text = `${this.botInGroupsConfig.name} meet`;
        }
      } else {
        msg.botCommandHandlerBreak = true;
      }
    }
    if (
      msg.botStart ||
      this.botCommandsToolsService.checkCommands(
        this.botCommandsToolsService.clearCommands(
          msg.text.split(' ').join('').trim(),
          [
            ...this.botInGroupsConfig.botNames[locale],
            ...this.botInGroupsConfig.botNames['en'],
          ],
          locale
        ),
        ['start']
      )
    ) {
      msg.text = `${this.botInGroupsConfig.name} meet`;
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
    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    const spyWord = this.botInGroupsConfig.spyWords.find((spyWord) =>
      this.botCommandsToolsService.checkCommands(msg.text, [spyWord], locale)
    );
    if (spyWord) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.help],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.generateHelpMessage(msg, {
            locale,
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
          [getText('meet')],
          locale
        )
      ) {
        return {
          type: 'markdown',
          message: msg,
          markdown: this.botCommandsToolsService.prepareHelpString(
            this.botCommandsToolsService.getRandomItem(
              this.botInGroupsConfig.botMeetingInformation[locale]
            )
          ),
        };
      }
    }

    return null;
  }
}
