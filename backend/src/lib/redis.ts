import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

let client: Redis | null = null;

try {
  client = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    retryStrategy(times: number) {
      if (times > 10) {
        logger.warn('Redis: baglanti denemeleri durduruldu');
        return null;
      }
      return Math.min(times * 100, 3000);
    },
  });
  client.on('error', (err) => {
    logger.warn('Redis hata', { message: err.message });
  });
} catch (e) {
  logger.warn('Redis baslatilamadi', {
    message: e instanceof Error ? e.message : String(e),
  });
  client = null;
}

export function getRedis(): Redis | null {
  return client;
}
