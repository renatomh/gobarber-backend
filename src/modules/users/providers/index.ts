import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

/* Instanciando essa classe apenas uma vez durante todo o ciclo de vida da operação (com o Singleton) */
container.registerSingleton<IHashProvider>(
  'HashProvider',
  BCryptHashProvider
);
