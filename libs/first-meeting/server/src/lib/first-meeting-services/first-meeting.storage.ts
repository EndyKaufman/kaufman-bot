import { FirstMeeting } from '@prisma/client';

export const FIRST_MEETING_STORAGE = 'FIRST_MEETING_STORAGE';

export type FirstMeetingStorageProvider = Pick<
  FirstMeetingStorage,
  | 'createUserFirstMeeting'
  | 'getUserFirstMeeting'
  | 'pathUserFirstMeeting'
  | 'removeUserFirstMeeting'
>;

export class FirstMeetingStorage {
  private readonly firstMeetingOfUsers: Record<number, FirstMeeting> = {};

  async getUserFirstMeeting({
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

  async createUserFirstMeeting(telegramUserId: number) {
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] = {
      firstname: '',
      lastname: '',
      gender: 'Male',
      status: 'StartMeeting',
    };
    return this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async removeUserFirstMeeting({ telegramUserId }: { telegramUserId: number }) {
    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
  }

  async pathUserFirstMeeting({
    telegramUserId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    firstMeeting,
  }: {
    telegramUserId: number;
    firstMeeting: Partial<FirstMeeting>;
  }) {
    let currentUserFirstMeeting = await this.getUserFirstMeeting({
      telegramUserId,
    });
    if (!currentUserFirstMeeting) {
      currentUserFirstMeeting = await this.createUserFirstMeeting(
        telegramUserId
      );
    }

    delete this.firstMeetingOfUsers[this.getKey({ telegramUserId })];
    this.firstMeetingOfUsers[this.getKey({ telegramUserId })] =
      await this.getUserFirstMeeting({ telegramUserId });
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
