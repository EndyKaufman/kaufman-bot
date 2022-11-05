import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependenciesToPackageJson, readJson } from '@nrwl/devkit';
import { satisfies } from 'semver';
import {
  kaufmanBotVersion,
  nestJsSchematicsVersion,
  nestJsVersion7,
  nestJsVersion8,
  nxVersion,
  reflectMetadataVersion,
  rxjsVersion6,
  rxjsVersion7,
} from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  // Old nest 7 and rxjs 6 by default
  let NEST_VERSION = nestJsVersion7;
  let RXJS = rxjsVersion6;

  const packageJson = readJson(tree, 'package.json');

  if (packageJson.dependencies['@angular/core']) {
    let rxjs = packageJson.dependencies['rxjs'];

    if (rxjs.startsWith('~') || rxjs.startsWith('^')) {
      rxjs = rxjs.substring(1);
    }

    if (satisfies(rxjs, rxjsVersion7)) {
      NEST_VERSION = nestJsVersion8;
      RXJS = packageJson.dependencies['rxjs'];
    }
  } else {
    NEST_VERSION = nestJsVersion8;
    RXJS = rxjsVersion7;
  }

  return addDependenciesToPackageJson(
    tree,
    {
      '@nestjs/common': NEST_VERSION,
      '@nestjs/core': NEST_VERSION,
      '@nestjs/platform-express': NEST_VERSION,
      'reflect-metadata': reflectMetadataVersion,
      '@kaufman-bot/bot-in-groups-server': kaufmanBotVersion,
      '@kaufman-bot/core-server': kaufmanBotVersion,
      '@kaufman-bot/debug-messages-server': kaufmanBotVersion,
      '@kaufman-bot/language-swither-server': kaufmanBotVersion,
      '@kaufman-bot/short-commands-server': kaufmanBotVersion,
      '@kaufman-bot/html-scraper-server': kaufmanBotVersion,
      '@kaufman-bot/facts-generator-server': kaufmanBotVersion,
      '@ngneat/transloco': '^4.0.0',
      '@ngneat/transloco-locale': '^4.0.0',
      'class-validator-multi-lang': '^0.130.201',
      'class-transformer': '^0.5.1',
      'class-transformer-global-storage': '^0.4.1-1',
      'env-var': '^7.3.0',
      'nestjs-telegraf': '^2.4.0',
      'nestjs-translates': '^1.0.3',
      telegraf: '^4.7.0',
      'nestjs-custom-injector': '^2.2.3',
      rxjs: RXJS,
      tslib: '^2.0.0',
    },
    {
      '@nestjs/schematics': nestJsSchematicsVersion,
      '@nestjs/testing': NEST_VERSION,
      '@nrwl/nest': nxVersion,
      '@ngneat/transloco-keys-manager': '^3.4.2',
      'source-map-support': '^0.5.21',
      rucken: '^4.4.4',
      nx: '^13.8.1',
    }
  );
}
