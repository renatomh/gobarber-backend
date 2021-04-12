import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class AuthenticateUserService {
  // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
  constructor(
    // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    // Fazendo a injeção da implementação do BCrypt para a interface do Hash Provider
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // Obtendo o repositório para o usuário e buscando o o usuário pelo e-mail definido
    const user = await this.usersRepository.findByEmail(email);

    // Caso nenhum usuário tenha sido encontrado
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // Comparamos a senha enviada com a hash criada e salva para o usuário
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);
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
