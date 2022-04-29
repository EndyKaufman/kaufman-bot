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
import { Markup } from 'telegraf';
import {
  FirstMeetingConfig,
  FIRST_MEETING_CONFIG,
} from '../first-meeting-config/first-meeting.config';
import {
  FirstMeeting,
  FirstMeetingStorage,
  FIRST_MEETING_STORAGE,
} from './first-meeting.storage';

export const DISABLE_FIRST_MEETING_COMMANDS = 'DISABLE_FIRST_MEETING_COMMANDS';

@Injectable()
export class FirstMeetingService
  implements BotCommandsProvider, OnContextBotCommands
{
  @CustomInject(FIRST_MEETING_STORAGE)
  private readonly firstMeetingStorage!: FirstMeetingStorage;

  constructor(
    @Inject(FIRST_MEETING_CONFIG)
    private readonly firstMeetingConfig: FirstMeetingConfig,
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly translatesService: TranslatesService
  ) {}

  async onContextBotCommands<
    TMsg extends BotCommandsProviderActionMsg = BotCommandsProviderActionMsg
  >(msg: TMsg, ctx): Promise<BotCommandsProviderActionResultType<TMsg>> {
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
          msg.text || msg.data,
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
            messagesMetadata: { EndMeetingRequest: msg },
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
          callback: async (result) =>
            await this.firstMeetingStorage.pathUserFirstMeeting({
              telegramUserId: this.botCommandsToolsService.getChatId(msg),
              firstMeeting: {
                messagesMetadata: { EndMeetingResponse: result },
              },
            }),
        };
      }

      if (contextFirstMeeting?.status === 'AskFirstname') {
        const text = this.translatesService.translate(
          getText(`What is your last name?`),
          locale
        );
        const currentFirstMeeting =
          await this.firstMeetingStorage.pathUserFirstMeeting({
            telegramUserId: this.botCommandsToolsService.getChatId(msg),
            firstMeeting: {
              messagesMetadata: { AskFirstnameRequest: msg },
            },
          });
        const firstname = this.prepareText(msg.text, locale) || 'Unknown';

        if (currentFirstMeeting?.messagesMetadata?.AskFirstnameResponse) {
          await ctx.telegram.editMessageText(
            currentFirstMeeting.messagesMetadata.AskFirstnameResponse.chat.id,
            currentFirstMeeting.messagesMetadata.AskFirstnameResponse
              .message_id,
            undefined,
            currentFirstMeeting.messagesMetadata.AskFirstnameResponse
              ? `${
                  currentFirstMeeting.messagesMetadata.AskFirstnameResponse.text
                } (${this.translatesService.translate(
                  getText('Your answer'),
                  locale
                )}: ${firstname})`
              : currentFirstMeeting.messagesMetadata.AskFirstnameResponse
          );
        }
        return {
          type: 'text',
          text,
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskLastname',
            firstname,
          },
          custom: {
            ...Markup.inlineKeyboard([
              Markup.button.callback(
                '➡️' +
                  this.translatesService.translate(getText('Next'), locale),
                'next'
              ),
              Markup.button.callback(
                '❌' +
                  this.translatesService.translate(getText('Cancel'), locale),
                'exit'
              ),
            ]),
          },
          callback: async (result) =>
            await this.firstMeetingStorage.pathUserFirstMeeting({
              telegramUserId: this.botCommandsToolsService.getChatId(msg),
              firstMeeting: {
                messagesMetadata: { AskLastnameResponse: result },
              },
            }),
        };
      }

      if (contextFirstMeeting?.status === 'AskLastname') {
        const text = this.translatesService.translate(
          getText(`What is your gender?`),
          locale
        );
        const currentFirstMeeting =
          await this.firstMeetingStorage.pathUserFirstMeeting({
            telegramUserId: this.botCommandsToolsService.getChatId(msg),
            firstMeeting: {
              messagesMetadata: { AskLastnameRequest: msg },
            },
          });
        const lastname = this.prepareText(msg.text, locale);
        if (currentFirstMeeting?.messagesMetadata?.AskLastnameResponse) {
          await ctx.telegram.editMessageText(
            currentFirstMeeting.messagesMetadata.AskLastnameResponse.chat.id,
            currentFirstMeeting.messagesMetadata.AskLastnameResponse.message_id,
            undefined,
            currentFirstMeeting.messagesMetadata.AskLastnameResponse
              ? `${
                  currentFirstMeeting.messagesMetadata.AskLastnameResponse.text
                } (${this.translatesService.translate(
                  getText('Your answer'),
                  locale
                )}: ${lastname})`
              : currentFirstMeeting.messagesMetadata.AskLastnameResponse
          );
        }
        return {
          type: 'text',
          text,
          message: msg,
          context: <Partial<FirstMeeting>>{
            ...msg.botCommandHandlerContext,
            status: 'AskGender',
            lastname,
          },
          custom: {
            ...Markup.inlineKeyboard([
              Markup.button.callback(
                '🚹' +
                  this.translatesService.translate(getText('Male'), locale),
                'male'
              ),
              Markup.button.callback(
                '🚺' +
                  this.translatesService.translate(getText('Female'), locale),
                'female'
              ),
              Markup.button.callback(
                '❌' +
                  this.translatesService.translate(getText('Cancel'), locale),
                'exit'
              ),
            ]),
          },
          callback: async (result) =>
            await this.firstMeetingStorage.pathUserFirstMeeting({
              telegramUserId: this.botCommandsToolsService.getChatId(msg),
              firstMeeting: {
                messagesMetadata: { AskGenderResponse: result },
              },
            }),
        };
      }

      if (contextFirstMeeting?.status === 'AskGender') {
        const firstMeeting: Partial<FirstMeeting> = {
          ...contextFirstMeeting,
          status: 'EndMeeting',
          gender: this.botCommandsToolsService.checkCommands(
            this.prepareText(msg.data || msg.text, locale),
            [getText('female'), getText('fm'), getText('f')],
            locale
          )
            ? 'Female'
            : 'Male',
          messagesMetadata: { AskGenderRequest: msg },
        };
        const currentFirstMeeting =
          await this.firstMeetingStorage.pathUserFirstMeeting({
            telegramUserId: this.botCommandsToolsService.getChatId(msg),
            firstMeeting,
          });
        if (currentFirstMeeting?.messagesMetadata?.AskGenderResponse) {
          await ctx.telegram.editMessageText(
            currentFirstMeeting.messagesMetadata.AskGenderResponse.chat.id,
            currentFirstMeeting.messagesMetadata.AskGenderResponse.message_id,
            undefined,
            currentFirstMeeting.messagesMetadata.AskGenderResponse
              ? `${
                  currentFirstMeeting.messagesMetadata.AskGenderResponse.text
                } (${this.translatesService.translate(
                  getText('Your answer'),
                  locale
                )}: ${this.translatesService.translate(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  firstMeeting.gender!,
                  locale
                )})`
              : currentFirstMeeting.messagesMetadata.AskGenderResponse
          );
        }
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
          callback: async (result) =>
            await this.firstMeetingStorage.pathUserFirstMeeting({
              telegramUserId: this.botCommandsToolsService.getChatId(msg),
              firstMeeting: {
                messagesMetadata: { EndMeetingResponse: result },
              },
            }),
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
        const text = this.translatesService.translate(
          this.botCommandsToolsService.getRandomItem([
            getText(`Hey! I'm {{botName}} {{smile}}, what's your name?`),
            getText(`Hey! what's your name?`),
          ]),
          locale,
          {
            botName: this.firstMeetingConfig.botName[locale],
            smile: '🙂',
          }
        );
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
          text,
          message: msg,
          context: <Partial<FirstMeeting>>{ status: 'AskFirstname' },
          custom: {
            ...Markup.inlineKeyboard([
              Markup.button.callback(
                '➡️' +
                  this.translatesService.translate(getText('Next'), locale),
                'next'
              ),
              Markup.button.callback(
                '❌' +
                  this.translatesService.translate(getText('Cancel'), locale),
                'exit'
              ),
            ]),
          },
          callback: async (result) =>
            await this.firstMeetingStorage.pathUserFirstMeeting({
              telegramUserId: this.botCommandsToolsService.getChatId(msg),
              firstMeeting: {
                messagesMetadata: { AskFirstnameResponse: result },
              },
            }),
        };
      }
    }

    if (
      firstMeeting?.status === 'EndMeeting' &&
      this.botCommandsToolsService.checkCommands(
        msg.text,
        [getText('hi'), getText('hello'), getText('hey')],
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
