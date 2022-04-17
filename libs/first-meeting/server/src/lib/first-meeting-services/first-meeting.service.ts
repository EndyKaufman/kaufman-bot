import {
  BotCommandsEnum,
  BotCommandsProvider,
  BotCommandsProviderActionMsg,
  BotCommandsProviderActionResultType,
  BotCommandsToolsService,
  OnContextBotCommands,
} from '@kaufman-bot/core-server';
import { Inject, Injectable } from '@nestjs/common';
import { getText } from 'class-validator-multi-lang';
import { CustomInject } from 'nestjs-custom-injector';
import { TranslatesService } from 'nestjs-translates';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import { FirstMeeting, FirstMeetingStorage } from './first-meeting.storage';

export const DISABLE_FIRST_MEETING_COMMANDS = 'DISABLE_FIRST_MEETING_COMMANDS';

@Injectable()
export class FirstMeetingService
  implements BotCommandsProvider, OnContextBotCommands
{
  @CustomInject(FirstMeetingStorage)
  private readonly firstMeetingStorage!: FirstMeetingStorage;

  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly firstMeetingConfig: FirstMeetingConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (msg?.botContext?.[DISABLE_FIRST_MEETING_COMMANDS]) {
      return null;
    }

    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    const contextFirstMeeting: Partial<FirstMeeting> =
      msg.botCommandHandlerContext;

    if (
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [this.firstMeetingConfig.name],
        locale
      ) ||
      Object.keys(contextFirstMeeting).length > 0
    ) {
      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [
            getText('exit'),
            getText('reset'),
            getText('cancel'),
            getText('stop'),
            getText('end'),
          ],
          locale
        )
      ) {
        await this.firstMeetingStorage.pathUserFirstMeeting({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          firstMeeting: {
            ...msg.botCommandHandlerContext,
            status: 'EndMeeting',
          },
        });
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`{{close}} Meeting canceled`),
            locale,
            { close: '❌' }
          ),
          message: msg,
          context: { status: 'EndMeeting' },
        };
      }

      if (contextFirstMeeting?.status === 'AskFirstname') {
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`What is your last name?`),
            locale
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskLastname',
            firstname: this.prepareText(msg.text, locale) || 'Unknown',
          },
        };
      }

      if (contextFirstMeeting?.status === 'AskLastname') {
        return {
          type: 'text',
          text: this.translatesService.translate(
            getText(`What is your gender?`),
            locale
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskGender',
            lastname: this.prepareText(msg.text, locale),
          },
        };
      }

      if (contextFirstMeeting?.status === 'AskGender') {
        const firstMeeting: Partial<FirstMeeting> = {
          ...contextFirstMeeting,
          status: 'EndMeeting',
          gender: this.botCommandsToolsService.checkCommands(
            this.prepareText(msg.text, locale),
            [getText('female'), getText('fm')],
            locale
          )
            ? 'Female'
            : 'Male',
        };
        await this.firstMeetingStorage.pathUserFirstMeeting({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          firstMeeting,
        });
        return {
          type: 'text',
          text: this.translatesService.translate(
            this.botCommandsToolsService.getRandomItem([
              getText(
                `Nice to meet you, {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
              ),
              getText(`Nice to meet you, {{firstname}} {{vulcan}}`),
            ]),
            locale,
            {
              vulcan: '🖖',
              ...firstMeeting,
              meetGender: this.mapGenderToMeetGender(firstMeeting, locale),
              firstname: this.botCommandsToolsService.capitalizeFirstLetter(
                firstMeeting.firstname,
                locale
              ),
              lastname: this.botCommandsToolsService.capitalizeFirstLetter(
                firstMeeting.lastname,
                locale
              ),
            }
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{ status: 'EndMeeting' },
        };
      }
    }

    return null;
  }

  async onHelp<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    return await this.onMessage({
      ...msg,
      text: `${this.firstMeetingConfig.name} ${BotCommandsEnum.help}`,
    });
  }

  async onMessage<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg): Promise<BotCommandsProviderActionResultType<TMsg>> {
    if (msg?.botContext?.[DISABLE_FIRST_MEETING_COMMANDS]) {
      return null;
    }

    const locale = this.botCommandsToolsService.getLocale(msg, 'en');

    const firstMeeting = await this.firstMeetingStorage.getUserFirstMeeting({
      telegramUserId: this.botCommandsToolsService.getChatId(msg),
    });
    const spyWord = this.firstMeetingConfig.spyWords.find((spyWord) =>
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
            name: this.firstMeetingConfig.title,
            descriptions: this.firstMeetingConfig.descriptions,
            usage: this.firstMeetingConfig.usage,
            category: this.firstMeetingConfig.category,
          }),
        };
      }

      if (
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [BotCommandsEnum.reset],
          locale
        )
      ) {
        await this.firstMeetingStorage.removeUserFirstMeeting({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
        });

        return {
          type: 'text',
          text: this.translatesService.translate(
            this.botCommandsToolsService.getRandomItem([
              getText('Your meeting information has been deleted {{unamused}}'),
              getText('I forgot about your existence {{worried}}'),
            ]),
            locale,
            {
              unamused: '😒',
              worried: '😟',
            }
          ),
          message: msg,
        };
      }

      if (
        !firstMeeting &&
        this.botCommandsToolsService.checkCommands(
          msg.text,
          [getText('start')],
          locale
        )
      ) {
        await this.firstMeetingStorage.pathUserFirstMeeting({
          telegramUserId: this.botCommandsToolsService.getChatId(msg),
          firstMeeting: {
            status: 'AskFirstname',
            firstname: '',
            lastname: '',
            gender: 'Male',
          },
        });
        return {
          type: 'text',
          text: this.translatesService.translate(
            this.botCommandsToolsService.getRandomItem([
              getText(`Hey! I'm {{botName}} {{smile}}, what's your name?`),
              getText(`Hey! what's your name?`),
            ]),
            locale,
            {
              botName: this.firstMeetingConfig.botName[locale],
              smile: '🙂',
            }
          ),
          message: msg,
          context: <Partial<FirstMeeting>>{ status: 'AskFirstname' },
        };
      }
    }

    if (
      firstMeeting?.status === 'EndMeeting' &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('hi'), getText('hello'), getText('hey'), getText('start')],
        locale
      )
    ) {
      return {
        type: 'markdown',
        markdown: this.translatesService
          .translate(
            this.botCommandsToolsService.getRandomItem([
              getText(
                `Hello {{meetGender}} {{firstname}} {{lastname}} {{vulcan}}`
              ),
              getText(`Hello {{firstname}} {{lastname}} {{handsplayed}}`),
              getText(`I'm glad to see you {{firstname}} {{wink}}`),
              getText(`Hi {{firstname}} {{vulcan}}`),
            ]),
            locale,
            {
              vulcan: '🖖',
              handsplayed: '🖐',
              wink: '😉',
              ...firstMeeting,
              meetGender: this.mapGenderToMeetGender(firstMeeting, locale),
              firstname: this.botCommandsToolsService.capitalizeFirstLetter(
                firstMeeting.firstname,
                locale
              ),
              lastname: this.botCommandsToolsService.capitalizeFirstLetter(
                firstMeeting.lastname,
                locale
              ),
            }
          )
          .split('  ')
          .join(' ')
          .split('  ')
          .join(' '),
        message: msg,
        context: {},
      };
    }

    return null;
  }

  private mapGenderToMeetGender(
    firstMeeting: Partial<FirstMeeting>,
    locale: string
  ) {
    return this.translatesService.translate(
      firstMeeting.gender === 'Female' ? getText('Madam') : getText('Sir'),
      locale
    );
  }

  private prepareText(text: string, locale: string) {
    if (
      this.botCommandsToolsService.checkCommands(
        text,
        [getText('skip'), getText('next')],
        locale
      )
    ) {
      return '';
    }
    return this.botCommandsToolsService
      .clearCommands(
        text,
        [
          getText('I'),
          getText('hi'),
          getText('hello'),
          getText('hey'),
          getText('am'),
          getText('my'),
          getText('is'),
          getText('name'),
          getText('lastname'),
          getText('firstname'),
          getText('last'),
          getText('first'),
        ],
        locale
      )
      .trim();
  }
}
