import { UnitTestRunner } from '../utils';

export interface InitGeneratorOptions {
  botName?: string;
  skipFormat?: boolean;
  unitTestRunner?: UnitTestRunner;
}