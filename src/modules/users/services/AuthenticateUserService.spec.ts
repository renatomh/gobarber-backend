// Testes unitários para a funcionalidade de autenticação de usuários
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

// Criando a categoria de testes
describe('AuthenticateUser', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();
        // Criando o serviço
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider
        );
        authenticateUser = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    // Teste para a autenticação de usuários
    it('should be able to authenticate', async () => {
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
        // Verificando se a resposta será rejeitada
        await expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        // Criando o novo usuário
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se a resposta é um erro
        await expect(authenticateUser.execute({
            email: 'johndoe@example.com',
            password: 'wrong-password',
        })).rejects.toBeInstanceOf(AppError);
    });
});
