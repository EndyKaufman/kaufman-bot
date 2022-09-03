import { BotCommandsProviderActionMsg } from '@kaufman-bot/core-server';

export const FIRST_MEETING_STORAGE = 'FIRST_MEETING_STORAGE';

export type FirstMeetingStorageProvider = Pick<
  FirstMeetingStorage,
  'clearState' | 'getState' | 'pathState' | 'delState'
>;

export const FirstMeetingStatus = {
  StartMeeting: 'StartMeeting',
  AskFirstname: 'AskFirstname',
  AskLastname: 'AskLastname',
  AskGender: 'AskGender',
  EndMeeting: 'EndMeeting',
};

export type FirstMeetingStatus =
  typeof FirstMeetingStatus[keyof typeof FirstMeetingStatus];

export const Gender = {
  Male: 'Male',
  Female: 'Female',
};

export type Gender = typeof Gender[keyof typeof Gender];

export type FirstMeeting = {
  id: string;
  userId: string;
  status: FirstMeetingStatus;
  firstname: string;
  lastname: string;
  gender: Gender;
  messagesMetadata?: {
    AskGenderRequest?: BotCommandsProviderActionMsg;
    AskGenderResponse?: BotCommandsProviderActionMsg;
    AskLastnameRequest?: BotCommandsProviderActionMsg;
    EndMeetingRequest?: BotCommandsProviderActionMsg;
    EndMeetingResponse?: BotCommandsProviderActionMsg;
    AskFirstnameRequest?: BotCommandsProviderActionMsg;
    AskLastnameResponse?: BotCommandsProviderActionMsg;
    AskFirstnameResponse?: BotCommandsProviderActionMsg;
  };
  createdAt: Date;
  updatedAt: Date;
};
export class FirstMeetingStorage {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  async getState({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<FirstMeeting | null> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }
    return null;
  }

  async clearState(telegramUserId: number): Promise<FirstMeeting | null> {
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] = {
      firstname: '',
      lastname: '',
      gender: 'Male',
      status: 'StartMeeting',
    };
    return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async delState({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async pathState({
    telegramUserId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state,
  }: {
    telegramUserId: number;
    state: Partial<FirstMeeting>;
  }): Promise<Partial<FirstMeeting> | null> {
    let currentState = await this.getState({
      telegramUserId,
    });
    if (!currentState) {
      currentState = await this.clearState(telegramUserId);
    }
    const newFirstMeeting = {
      ...currentState,
      ...state,
      messagesMetadata: {
        ...(currentState?.messagesMetadata || {}),
        ...state.messagesMetadata,
      },
    };
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] = newFirstMeeting;
    return newFirstMeeting;
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
