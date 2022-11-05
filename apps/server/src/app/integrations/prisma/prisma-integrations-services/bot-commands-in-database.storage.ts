import {
  BotCommandsStorageProvider,
  BotCommandsToolsService,
  LATEST_MESSAGE_ID,
  StorageItem,
} from '@kaufman-bot/core-server';
import { PrismaClientService } from '@kaufman-bot/prisma-server';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class BotCommandsInDatabaseStorage<
  TMessage extends { context?: Record<string, unknown> }
> implements BotCommandsStorageProvider<TMessage>
{
  constructor(
    private readonly botCommandsToolsService: BotCommandsToolsService,
    private readonly prismaClientService: PrismaClientService
  ) {}

  private async getOrCreateUser(userId: string): Promise<User> {
    try {
      return await this.prismaClientService.user.findFirstOrThrow({
        where: { telegramId: userId },
      });
    } catch (error) {
      return await this.prismaClientService.user.create({
        data: { telegramId: userId },
      });
    }
  }

  async getStateByUsedMessageId(
    userId: string,
    usedMessageId: string
  ): Promise<StorageItem<TMessage> | null> {
    const user = await this.getOrCreateUser(userId);
    const states = await this.prismaClientService.state.findMany({
      where: {
        userId: user.id,
        messageId: { not: LATEST_MESSAGE_ID },
        usedMessageIds: { has: usedMessageId },
      },
    });
    if (states.length === 1) {
      const state = states[0];
      return {
        handlerId: state.handlerId || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        request: (state.request || {}) as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response: (state.request || {}) as any,
        usedMessageIds: state.usedMessageIds,
        context: state.context as Prisma.JsonObject,
      };
    }
    if (states.length > 1) {
      throw new Error(
        `Founded ${states.length} states with usedMessageId = ${usedMessageId}`
      );
    }
    return null;
  }

  async getState(
    userId: string,
    messageId: string
  ): Promise<StorageItem<TMessage> | null> {
    const user = await this.getOrCreateUser(userId);
    return (
      ((await this.prismaClientService.state.findFirst({
        where: {
          userId: user.id,
          messageId: messageId,
        },
      })) as StorageItem<TMessage>) || null
    );
  }

  async delState(userId: string, messageId: string): Promise<void> {
    const user = await this.getOrCreateUser(userId);
    await this.prismaClientService.state.deleteMany({
      where: { userId: user.id, messageId },
    });
  }

  async patchState(
    userId: string,
    messageId: string,
    state: Partial<StorageItem<TMessage>>
  ): Promise<void> {
    const currentState = await this.getState(userId, messageId);

    const usedMessageIds = [
      ...new Set(
        [
          ...(currentState?.usedMessageIds || []),
          ...(state.usedMessageIds || []),
          state.request
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.request.message
              )
            : undefined,
          state.response
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.response.message
              )
            : undefined,
          state.request
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(state.request)
            : undefined,
          state.response
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              this.botCommandsToolsService.getReplyMessageId<any>(
                state.response
              )
            : undefined,
        ].filter(Boolean)
      ),
    ];
    const user = await this.getOrCreateUser(userId);
    if (currentState) {
      await this.prismaClientService.state.updateMany({
        data: {
          handlerId: state.handlerId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          request: (state.request || {}) as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response: (state.request || {}) as any,
          context: {
            ...(currentState?.context || {}),
            ...(state?.context || {}),
          },
          usedMessageIds: usedMessageIds as string[],
          updatedAt: new Date(),
        },
        where: {
          userId: user.id,
          messageId,
        },
      });
    } else {
      await this.prismaClientService.state.create({
        data: {
          userId: user.id,
          messageId,
          handlerId: state.handlerId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          request: state.request as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          response: state.response as any,
          context: {
            ...(state?.context || {}),
          },
          usedMessageIds: usedMessageIds as string[],
        },
      });
    }
  }
}
