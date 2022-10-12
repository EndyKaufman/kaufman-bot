import { BotCommandsProviderActionMsg } from '@kaufman-bot/core-server';
import { v4 } from 'uuid';

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
  private readonly demoTaxiOrdersOfUsers: Record<string, DemoTaxiOrders> = {};

  async getCurrentStep(userId: string) {
    const state = await this.getState(userId);
    const step = (state?.messagesMetadata || []).find(
      (item) => !item?.request || !item?.response
    );
    const stepKey = step?.step || DemoTaxiOrdersSteps.Start;
    const nextStepKey = DEMO_TAXI_ORDERS_STEPS_KEYS.find(
      (key, index) => DEMO_TAXI_ORDERS_STEPS_KEYS[index - 1] === stepKey
    ) as DemoTaxiOrdersSteps;
    return { state, step, stepKey, nextStepKey };
  }

  async getState(userId: string): Promise<DemoTaxiOrders | null> {
    const state: DemoTaxiOrders = this.demoTaxiOrdersOfUsers[userId];
    if (state) {
      return state;
    }
    return null;
  }

  async clearState(userId: string): Promise<DemoTaxiOrders | null> {
    this.demoTaxiOrdersOfUsers[userId] = {
      id: '',
      userId: '',
      messagesMetadata: [],
    };
    return this.demoTaxiOrdersOfUsers[userId];
  }

  async delState(userId: string) {
    delete this.demoTaxiOrdersOfUsers[userId];
  }

  async pathState({
    userId,
    state,
  }: {
    userId: string;
    state: Partial<DemoTaxiOrders>;
  }): Promise<Partial<DemoTaxiOrders> | null> {
    let currentState = await this.getState(userId);
    if (!currentState) {
      currentState = await this.clearState(userId);
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
      id: currentState?.id || v4(),
    };
    this.demoTaxiOrdersOfUsers[userId] = newDemoTaxiOrders as DemoTaxiOrders;

    console.log(newDemoTaxiOrders);

    return newDemoTaxiOrders;
  }
}
