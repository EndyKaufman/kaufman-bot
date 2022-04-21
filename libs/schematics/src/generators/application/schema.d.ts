import { Linter } from '@nrwl/linter';
import { UnitTestRunner } from '../../utils/test-runners';

export interface ApplicationGeneratorOptions {
  name: string;
  directory?: string;
  frontendProject?: string;
  linter?: Exclude<Linter, Linter.TsLint>;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  standaloneConfig?: boolean;
  tags?: string;
  unitTestRunner?: UnitTestRunner;
  setParserOptionsProject?: boolean;
  botName?: string;
}

interface NormalizedOptions extends ApplicationGeneratorOptions {
  appProjectRoot: Path;
}
