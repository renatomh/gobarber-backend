import { Request, Response, NextFunction } from 'express';
import redis from 'redis';
import AppError from '@shared/errors/AppError';
import { RateLimiterRedis } from 'rate-limiter-flexible';

/* Criando o cliente para o Redis */
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

/* Documentação do node-rate-limiter-flexible: https://github.com/animir/node-rate-limiter-flexible */
/* Aqui armazena-se o IP do usuário e quntas requisições foram feitas */
const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  /* Quantidade de requisições por duração que podem ser feitas por IP */
  points: 5,
  duration: 1,
  /* Definindo o tempo (em segundos) que o usuário ficará bloqueado após atingir o limite de requisições */
  blockDuration: 60,
});

/* Definindo o middleware para limitar o número de requisições por IP */
export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction): Promise<void> {
  /* Utilizando o limitador criado */
  try {
    await limiter.consume(request.ip);
    return next();
  }
  /* Caso ocorra erro (usuário tenha feito muitas requisições) */
  catch (err) {
    /* Informamos sobre o erro com o código apropriado */
    throw new AppError('Too many requests', 429);
  }
}
