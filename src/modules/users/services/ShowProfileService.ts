import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

/* Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos) */
@injectable()
class ShowProfileService {
  /* Definindo o parâmetro e já criando a variável (disponível no TypeScript somente) */
  constructor(
    /* Fazendo a injeção de dependências (desnecessário em sistemas pequenos) */
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    /* Caso não encontre o usário */
    if (!user) {
      throw new AppError('User not found');
    }

    /* Retornando o usuário */
    return user;
  }
}

export default ShowProfileService;
