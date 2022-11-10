import type { GeneratorCallback, Tree } from '@nrwl/devkit';
import { addDependenciesToPackageJson } from '@nrwl/devkit';
import {
  kaufmanBotVersion,
  nestJsVersion,
  nxVersion,
  reflectMetadataVersion,
  rxjsVersion,
  tsLibVersion,
} from '../../../utils/versions';

export function addDependencies(tree: Tree): GeneratorCallback {
  return addDependenciesToPackageJson(
    tree,
    {
      '@nestjs/common': nestJsVersion,
      '@nestjs/core': nestJsVersion,
      '@nestjs/platform-express': nestJsVersion,
      'reflect-metadata': reflectMetadataVersion,
      rxjs: rxjsVersion,
      tslib: tsLibVersion,
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
      '@grammyjs/nestjs': '^0.3.3',
      'nestjs-translates': '^1.0.3',
      grammy: '^1.12.0',
      'nestjs-custom-injector': '^2.2.3',
    },
    {
      '@nestjs/schematics': '9.0.3',
      '@nestjs/testing': nestJsVersion,
      '@nrwl/nest': nxVersion,
      '@ngneat/transloco-keys-manager': '^3.4.2',
      'source-map-support': '^0.5.21',
      rucken: '^4.4.4',
      nx: nxVersion,
    }
  );
}
