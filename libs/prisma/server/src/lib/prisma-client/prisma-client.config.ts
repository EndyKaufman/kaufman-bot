export const PRISMA_CLIENT_CONFIG = Symbol('PRISMA_CLIENT_CONFIG');

export interface PrismaClientConfig {
  databaseUrl: string;
  logging: 'all_queries' | 'long_queries';
  maxQueryExecutionTime: number;
}
