import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { getRedis } from '../lib/redis';
import { logger } from '../utils/logger';

function buildRedisStore(prefix: string): RedisStore | undefined {
  const redis = getRedis();
  if (!redis) return undefined;
  try {
    return new RedisStore({
      prefix,
      sendCommand: (
        command: string,
        ...args: string[]
      ): Promise<RedisReply> =>
        redis.call(
          command,
          ...args
        ) as Promise<RedisReply>,
    });
  } catch (e) {
    logger.warn('Redis rate limit store olusturulamadi', {
      message: e instanceof Error ? e.message : String(e),
    });
    return undefined;
  }
}

const generalRedis = buildRedisStore('rl:general:');
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Cok fazla istek, lutfen bekleyin' },
  standardHeaders: true,
  legacyHeaders: false,
  ...(generalRedis ? { store: generalRedis } : {}),
});

/** OTP SMS / abuse koruması — IP başına sıkı limit */
const otpSendRedis = buildRedisStore('rl:otp-send:');
export const otpSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    error:
      'Cok fazla OTP istegi. Lutfen bir sure sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  ...(otpSendRedis ? { store: otpSendRedis } : {}),
});

/** OTP doğrulama + giriş denemeleri */
const authRedis = buildRedisStore('rl:auth:');
export const authVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Cok fazla giris denemesi' },
  standardHeaders: true,
  legacyHeaders: false,
  ...(authRedis ? { store: authRedis } : {}),
});
