import { BotCommandsProviderActionMsg } from '@kaufman-bot/core-server';

export const DEMO_TAXI_ORDERS_STORAGE = 'DEMO_TAXI_ORDERS_STORAGE';

export type DemoTaxiOrdersStorageProvider = Pick<
  DemoTaxiOrdersStorage,
  'clearState' | 'getState' | 'pathState' | 'delState'
>;

export enum DemoTaxiOrdersSteps {
  Start = 'Start',
  Direction = 'Direction',
  CountOfPassengers = 'CountOfPassengers',
  ContactPhone = 'ContactPhone',
  Finished = 'Finished',
}

export const DEMO_TAXI_ORDERS_STEPS_KEYS = Object.keys(DemoTaxiOrdersSteps);

export const Direction = {
  City: 'City',
  Village: 'Village',
};

export type Direction = typeof Direction[keyof typeof Direction];

export type DemoTaxiOrders = {
  id: string;
  userId: string;
  messagesMetadata?: {
    step: DemoTaxiOrdersSteps;
    request?: BotCommandsProviderActionMsg;
    response?: BotCommandsProviderActionMsg;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class DemoTaxiOrdersStorage {
  private readonly demoTaxiOrdersOfUsers: Record<number, DemoTaxiOrders> = {};

  async getCurrentStep({ telegramUserId }: { telegramUserId: number }) {
    const state = await this.getState({ telegramUserId });
    const step = (state?.messagesMetadata || []).find(
      (item) => !item?.request || !item?.response
    );
    const stepKey = step?.step || DemoTaxiOrdersSteps.Start;
    const nextStepKey = DEMO_TAXI_ORDERS_STEPS_KEYS.find(
      (key, index) => DEMO_TAXI_ORDERS_STEPS_KEYS[index - 1] === stepKey
    ) as DemoTaxiOrdersSteps;
    return { state, step, stepKey, nextStepKey };
  }

  async getState({
    telegramUserId,
  }: {
    telegramUserId: number;
  }): Promise<DemoTaxiOrders | null> {
    const state: DemoTaxiOrders =
      this.demoTaxiOrdersOfUsers[this.getKey({ telegramUserId })];
    if (state) {
      return state;
    }
    return null;
  }

  async clearState(telegramUserId: number): Promise<DemoTaxiOrders | null> {
    this.demoTaxiOrdersOfUsers[this.getKey({ telegramUserId })] = {
      id: '',
      userId: '',
      messagesMetadata: [],
    };
    return this.demoTaxiOrdersOfUsers[this.getKey({ telegramUserId })];
  }

  async delState({ telegramUserId }: { telegramUserId: number }) {
    delete this.demoTaxiOrdersOfUsers[this.getKey({ telegramUserId })];
  }

  async pathState({
    telegramUserId,
    state,
  }: {
    telegramUserId: number;
    state: Partial<DemoTaxiOrders>;
  }): Promise<Partial<DemoTaxiOrders> | null> {
    let currentState = await this.getState({
      telegramUserId,
    });
    if (!currentState) {
      currentState = await this.clearState(telegramUserId);
    }
    const newDemoTaxiOrders = {
      ...currentState,
      ...state,
      messagesMetadata: DEMO_TAXI_ORDERS_STEPS_KEYS.map((stepKey) => ({
        ...(currentState?.messagesMetadata?.find(
          (step) => step.step === stepKey
        ) || {}),
        ...(state?.messagesMetadata?.find((step) => step.step === stepKey) ||
          {}),
        step: stepKey as DemoTaxiOrdersSteps,
      })),
    };
    this.demoTaxiOrdersOfUsers[this.getKey({ telegramUserId })] =
      newDemoTaxiOrders;
    return newDemoTaxiOrders;
  }

  private getKey({ telegramUserId }: { telegramUserId: number }) {
    return telegramUserId.toString();
  }
}
