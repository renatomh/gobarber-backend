import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class UpdateProfileService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({
        user_id,
        name,
        email,
        old_password,
        password
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        // Caso não encontre o usário
        if (!user) {
            throw new AppError('User not found');
        }

        // Verificando se já existe um outro usuário com o endereço de e-mail
        const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
        if (userWithUpdatedEmail && user_id != userWithUpdatedEmail.id) {
            throw new AppError('Email already in use.');
        }

        // Atualizando os dados do usuário
        user.name = name;
        user.email = email;

        // Caso tenha solicitado a nova senha, mas não informado a antiga
        if (password && !old_password) {
            throw new AppError('You need to provide the old password in order to set a new password.');
        }

        // Caso tenha sido passada uma nova senha e a antiga
        if (password && old_password) {
            // Verificando se a senha antiga está correta
            const checkOldPassword = await this.hashProvider.compareHash(
                old_password,
                user.password
            );
            if (!checkOldPassword) {
                throw new AppError('Incorrect old password.');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        // Salvando o usuário no repositório e retornando-o
        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
