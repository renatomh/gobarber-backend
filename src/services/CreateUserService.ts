import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    // Obtendo o repositório para o usuário e verificando se o e-mail já foi cadastrado
    const usersRepository = getRepository(User);
    const checkUserExists = await usersRepository.findOne({
      where: { email },
    });

    // Caso o usuário já exista, informamos o erro
    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    // Caso contrário, criptografamos a senha, criamos o usuário e salvamos no banco de dados
    const hashedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await usersRepository.save(user);

    return user;
  }
}

export default CreateUserService;
