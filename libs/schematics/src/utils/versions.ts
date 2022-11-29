import { readFileSync } from 'fs';
import { join } from 'path';

export const nxVersion = '15.0.13';

export const reflectMetadataVersion = '^0.1.13';
export const nestJsVersion = '^9.0.0';
export const rxjsVersion = '^7.0.0';
export const tsLibVersion = '^2.3.0';

export const kaufmanBotVersion =
  process.env.KAUFMAN_BOT_VERSION ||
  JSON.parse(
    readFileSync(join(__dirname, '..', '..', 'package.json')).toString()
  ).version ||
  '*';
