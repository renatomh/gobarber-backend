// Testes unitários para a funcionalidade de criação de usuários
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

// Criando a categoria de testes
describe('CreateUser', () => {
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
    });

    // Teste para a criação de novos usuários
    it('should be able to create a new user', async () => {
        // Criando o novo usuário
        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se o usuário possui a propriedade 'id'
        expect(user).toHaveProperty('id');
    });

    // Teste para a criação de usuários com e-mail repetido
    it('should not be able to create a new user with an already existing email', async () => {
        // Criando o novo usuário
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Testando para ver se a criação de um novo usuário com o mesmo e-mail resultará em erro
        // Tentando criar um usuário com o e-mail repetido
        // Deve ser utilizado sem o 'await' dentro do expect
        await expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });
});
