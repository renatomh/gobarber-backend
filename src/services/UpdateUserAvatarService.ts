import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    // Pegando o repositório para os usuários e buscando o usuário
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    // Caso nenhum usuário seja encontrando, informamos o erro
    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    // Caso o usuário já possua um avatar, removemos o arquivo antigo
    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    // Atualizando a coluna do avatar no banco de dados e salvando a informação
    user.avatar = avatarFilename;
    await usersRepository.save(user);

    // Retornando os dados criados
    return user;
  }
}

export default UpdateUserAvatarService;
