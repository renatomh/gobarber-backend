import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class CreateUserService {
  // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
  constructor(
    // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    // Fazendo a injeção da implementação do BCrypt para a interface do Hash Provider
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ name, email, password }: IRequest): Promise<User> {
    // Obtendo o repositório para o usuário e verificando se o e-mail já foi cadastrado
    const checkUserExists = await this.usersRepository.findByEmail(email);

    // Caso o usuário já exista, informamos o erro
    if (checkUserExists) {
      throw new AppError('Email address already used.');
    }

    // Caso contrário, criptografamos a senha, criamos o usuário e salvamos no banco de dados
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // Precisamos ainda invalidar o cache para as listas de usuários
    await this.cacheProvider.invalidatePrefix('providers-list');

    return user;
  }
}

export default CreateUserService;
