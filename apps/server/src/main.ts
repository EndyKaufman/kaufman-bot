import { Logger } from '@nestjs/common';

const logger = new Logger('Application');

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

import { NestFactory } from '@nestjs/core';
import env from 'env-var';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = env.get('PORT').default(3333).asPortNumber();
  await app.listen(port);
  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

try {
  bootstrap().catch((err) => {
    logger.error(err, err.stack);
  });
} catch (err) {
  logger.error(err, err.stack);
}

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    logger.log('exit: clean');
  }
  if (exitCode || exitCode === 0) {
    if (exitCode !== 0) {
      logger.error(exitCode, exitCode.stack);
    } else {
      logger.log(`exit: code - ${exitCode}`);
    }
  }
  if (options.exit) {
    process.exit();
  }
}
