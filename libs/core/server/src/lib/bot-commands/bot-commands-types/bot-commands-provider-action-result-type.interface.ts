import { BotCommandsContextType } from './bot-commands-context-type.interface';
import { BotCommandsProviderActionMsg } from './bot-commands-provider-action-msg.interface';

export type BotCommandsProviderActionResultCommonType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMessage extends BotCommandsContextType
> = {
  message: TMessage;
  context?: TMessage['context'];
  recursive?: boolean;
  newState?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  custom?: any;
  callback?: (
    message: BotCommandsProviderActionMsg,
    context: TMessage['context']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
};

export type BotCommandsProviderActionResultType<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TMessage extends BotCommandsContextType
> =
  | ((
      | {
          type: 'markdown';
          markdown: string;
        }
      | {
          type: 'html';
          html: string;
        }
      | {
          type: 'text';
          text: string;
        }
      | {
          type: 'message';
        }
      | {
          type: 'stop';
        }
    ) &
      BotCommandsProviderActionResultCommonType<TMessage>)
  | null;
