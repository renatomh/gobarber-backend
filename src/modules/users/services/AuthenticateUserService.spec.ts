// Testes unitários para a funcionalidade de autenticação de usuários
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

// Criando a categoria de testes
describe('AuthenticateUser', () => {
    // Teste para a autenticação de usuários
    it('should be able to authenticate', async () => {
        // Instanciando o repositório fake
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        // Criando o novo usuário
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Autenticando o usuário
        const response = await authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se a resposta possui a propriedade 'token' e o usuário
        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        // Instanciando o repositório fake
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        // Verificando se a resposta será rejeitada
        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        // Instanciando o repositório fake
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

        // Criando o novo usuário
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se a resposta é um erro
        expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: 'wrong-password',
        })).rejects.toBeInstanceOf(AppError);
    });
});
