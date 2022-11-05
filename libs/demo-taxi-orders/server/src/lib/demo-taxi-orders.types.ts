export enum NavigationButtons {
  Prev = 'Prev',
  Next = 'Next',
  Done = 'Done',
  Cancel = 'Cancel',
}

export enum DemoTaxiOrdersSteps {
  Start = 'Start',
  Direction = 'Direction',
  CountOfPassengers = 'CountOfPassengers',
  ContactPhone = 'ContactPhone',
  Complete = 'Complete',
  End = 'End',
}

export enum Direction {
  City = 'City',
  Village = 'Village',
}

export enum CountOfPassengers {
  P1 = '1',
  P2 = '2',
  P3 = '3',
  P4 = '4',
}

export type DemoTaxiLocalContext = {
  currentStep?: DemoTaxiOrdersSteps;
  direction?: Direction;
  countOfPassengers?: CountOfPassengers;
  contactPhone?: string;
  stateMessageId?: string;
  contactPhoneMessageId?: string;
  contact?: {
    phone_number: string;
    first_name: string;
    user_id: number;
  };
};
