import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';

const versionTxtPath = resolve(__dirname, '..', 'VERSION.txt');
const envProdFilePath = resolve(__dirname, '..', 'env', 'prod.env.sh');

const versionTxtContent = readFileSync(versionTxtPath).toString();
const envProdFileLines = readFileSync(envProdFilePath).toString().split('\n');

const MARKER = 'standard-version:';

for (let i = 0; i < envProdFileLines.length; i++) {
  const line = envProdFileLines[i];
  if (line.includes(MARKER)) {
    envProdFileLines[i + 1] = line.split(MARKER)[1].trim().replace('$VERSION', versionTxtContent);
  }
}

if (!existsSync(dirname(envProdFilePath))) {
  mkdirSync(dirname(envProdFilePath), { recursive: true });
}
writeFileSync(envProdFilePath, envProdFileLines.join('\n'));
