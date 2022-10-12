import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomInject, CustomInjectorService } from 'nestjs-custom-injector';
import {
  PrismaClientConfig,
  PRISMA_CLIENT_CONFIG,
} from './prisma-client.config';

@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private logger = new Logger(PrismaClientService.name);

  @CustomInject(PRISMA_CLIENT_CONFIG)
  private readonly prismaClientConfig!: PrismaClientConfig;

  constructor(customInjectorService: CustomInjectorService) {
    super({
      datasources: {
        db: {
          url: customInjectorService.getProvider<PrismaClientConfig>(
            PRISMA_CLIENT_CONFIG
          ).databaseUrl,
        },
      },
      rejectOnNotFound: true,
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('onModuleInit');
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('query', (e) => {
        if (this.prismaClientConfig.logging === 'all_queries') {
          if (e.query !== 'SELECT 1') {
            this.logger.log(
              `query: ${e.query}, params: ${e.params}, duration: ${e.duration}`
            );
          }
        }
        if (this.prismaClientConfig.logging === 'long_queries') {
          if (e.duration >= this.prismaClientConfig.maxQueryExecutionTime) {
            this.logger.warn(
              `query is slow: ${e.query}, params: ${e.params}, execution time: ${e.duration}`
            );
          }
        }
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).$on('error', (e) => {
        this.logger.error(`target: ${e.target}, message: ${e.message}`);
      });
      await this.$connect();
      setInterval(
        () =>
          this.$queryRaw`SELECT 1`.catch((err) =>
            this.logger.error(err, err.stack)
          ),
        5 * 60000
      );
    } catch (err) {
      this.logger.error(err, err.stack);
    }
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('onModuleDestroy');
    await this.$disconnect();
  }
}
