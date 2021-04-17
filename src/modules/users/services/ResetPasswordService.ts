import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    token: string;
    password: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class ResetPasswordService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ token, password }: IRequest): Promise<void> {
        // Obtendo o token do usuário
        const userToken = await this.userTokensRepository.findByToken(token);

        // Verificando se o user token existe
        if (!userToken) {
            throw new AppError('User token does not exists');
        }
        // Obtendo o usuário
        const user = await this.usersRepository.findById(userToken?.user_id);

        // Verificando se o usuário existe
        if (!user) {
            throw new AppError('User does not exists');
        }

        // Verificando se o token ainda está válido
        const tokenCreatedAt = userToken.created_at;
        const tokenExpiresInHours = 2;
        if (differenceInHours(Date.now(), tokenCreatedAt) > tokenExpiresInHours) {
            throw new AppError('This token has already expired');
        }

        // Atribuindo a nova senha criptografada ao usuário
        user.password = await this.hashProvider.generateHash(password);
        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
