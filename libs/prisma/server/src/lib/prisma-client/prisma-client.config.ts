export const PRISMA_CLIENT_CONFIG = 'PRISMA_CLIENT_CONFIG';

export interface PrismaClientConfig {
  databaseUrl: string;
  logging: 'all_queries' | 'long_queries';
  maxQueryExecutionTime: number;
}
