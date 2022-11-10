import type { InitGeneratorOptions } from '../schema';

export function normalizeOptions(
  options: InitGeneratorOptions
): InitGeneratorOptions& Pick<Required<InitGeneratorOptions>, 'botName'> {
  return {
    ...options,
    unitTestRunner: options.unitTestRunner ?? 'jest',
    botName: options.botName ?? 'Bot',
  };
}