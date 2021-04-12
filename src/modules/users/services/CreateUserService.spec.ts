// Testes unitários para a funcionalidade de criação de usuários
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';

// Criando a categoria de testes
describe('CreateUser', () => {
    // Teste para a criação de novos usuários
    it('should be able to create a new user', async () => {
        // Instanciando o repositório fake
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

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
        // Instanciando o repositório fake
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        // Criando o novo usuário
        await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Testando para ver se a criação de um novo usuário com o mesmo e-mail resultará em erro
        // Tentando criar um usuário com o e-mail repetido
        // Deve ser utilizado sem o 'await'
        expect(createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        })).rejects.toBeInstanceOf(AppError);
    });
});
