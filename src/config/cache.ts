import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  /* Limitando as opções de driver de cache */
  driver: 'redis';
  config: {
    /* Definindo as configurações para o Redis */
    redis: RedisOptions;
  };
}

export default {
  driver: process.env.CACHE_DRIVER || 'redis',
  config: {
    /* Definindo as configurações para o Redis */
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS || undefined,
    }
  }
} as ICacheConfig;
