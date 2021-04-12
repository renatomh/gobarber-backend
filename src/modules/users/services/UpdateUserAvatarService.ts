import path from 'path';
import fs from 'fs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import uploadConfig from '@config/upload';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class UpdateUserAvatarService {
  // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
  constructor(
    // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) { }

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // Pegando o repositório para os usuários e buscando o usuário
    const user = await this.usersRepository.findById(user_id);

    // Caso nenhum usuário seja encontrando, informamos o erro
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // Caso o usuário já possua um avatar, removemos o arquivo antigo
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    // Atualizando a coluna do avatar no banco de dados e salvando a informação
    const filename = await this.storageProvider.saveFile(avatarFilename);
    user.avatar = filename;
    await this.usersRepository.save(user);

    // Retornando os dados criados
    return user;
  }
}

export default UpdateUserAvatarService;
