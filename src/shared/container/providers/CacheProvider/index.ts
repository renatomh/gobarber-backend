/* Aqui fazemos as injeções das dependências de pacotes externos nas interfaces da aplicação */
import { container } from 'tsyringe';

import ICacheProvider from './models/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

/* Organizando os providers criados para a seleção da implementação a partir da seleção do driver */
const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>(
  'CacheProvider',
  providers.redis,
);
