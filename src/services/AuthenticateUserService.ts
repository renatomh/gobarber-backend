import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // Obtendo o repositório para o usuário e buscando o o usuário pelo e-mail definido
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne({ where: { email } });

    // Caso nenhum usuário tenha sido encontrado
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // Comparamos a senha enviada com a hash criada e salva para o usuário
    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // Definindo o token jwt e criando com a string secreta, ID de usuário e validade
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // Retornando os dados criados
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
