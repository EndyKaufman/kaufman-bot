import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface BotInGroupsConfig {
  title: string;
  name: string;
  descriptions: string;
  usage: string[];
  spyWords: string[];
  botNames: { [langCode: string]: string[] };
  botMeetingInformation: { [langCode: string]: string[] };
  category: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGroupGlobalContext?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultGlobalContext?: Record<string, any>;
  transformMessageText?: (locale: string, messageText: string) => string;
}

export const {
  ConfigurableModuleClass: BotInGroupsConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: BOT_IN_GROUPS_CONFIG,
  ASYNC_OPTIONS_TYPE: BOT_IN_GROUPS_ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE: BOT_IN_GROUPS_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<
  Pick<
    BotInGroupsConfig,
    | 'botNames'
    | 'botMeetingInformation'
    | 'defaultGroupGlobalContext'
    | 'defaultGlobalContext'
    | 'transformMessageText'
  >,
  'forRoot'
>({
  optionsInjectionToken: 'BOT_IN_GROUPS_CONFIG',
}).build();
