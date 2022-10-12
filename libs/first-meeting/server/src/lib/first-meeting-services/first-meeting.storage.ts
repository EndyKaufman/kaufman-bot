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
  private readonly firstMeetingOfUsers: Record<string, FirstMeeting> = {};

  async getState(userId: string): Promise<FirstMeeting | null> {
    const currentFirstMeetingOfUsers: FirstMeeting =
      this.firstMeetingOfUsers[userId];
    if (currentFirstMeetingOfUsers) {
      return currentFirstMeetingOfUsers;
    }
    return null;
  }

  async clearState(userId: string): Promise<FirstMeeting | null> {
    this.firstMeetingOfUsers[userId] = {
      firstname: '',
      lastname: '',
      gender: 'Male',
      status: 'StartMeeting',
    } as FirstMeeting;
    return this.firstMeetingOfUsers[userId];
  }

  async delState(userId: string) {
    delete this.firstMeetingOfUsers[userId];
  }

  async pathState({
    userId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state,
  }: {
    userId: string;
    state: Partial<FirstMeeting>;
  }): Promise<Partial<FirstMeeting> | null> {
    let currentState = await this.getState(userId);
    if (!currentState) {
      currentState = await this.clearState(userId);
    }
    const newFirstMeeting = {
      ...currentState,
      ...state,
      messagesMetadata: {
        ...(currentState?.messagesMetadata || {}),
        ...state.messagesMetadata,
      },
    };
    this.firstMeetingOfUsers[userId] = newFirstMeeting as FirstMeeting;
    return newFirstMeeting;
  }
}
