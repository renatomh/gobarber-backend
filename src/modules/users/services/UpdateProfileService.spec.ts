// Testes unitários para a funcionalidade de atualização de perfil
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

// Criando a categoria de testes
describe('UpdateProfile', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        // Criando o serviço
        updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    // Testes para a atualização de usuário
    it("should be able to update a user's profile", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Atualizando o perfil do usuário
        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
        });

        // Verificando se o usuário possui os novos dados
        expect(updatedUser.name).toBe('John Trê');
        expect(updatedUser.email).toBe('johntre@example.com');
    });

    it("should not be able to update the profile from non-existing user", async () => {
        // Verificando se ocorre o erro
        await expect(updateProfileService.execute({
            user_id: 'non-existing-user-id',
            name: 'non-existing-user-name',
            email: 'non-existing-user-email',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to change a user's email to an already registered email address", async () => {
        // Criando os novos usuários
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const user = await fakeUsersRepository.create({
            name: 'Susan Doe',
            email: 'susandoe@example.com',
            password: '123456',
        });

        // Verificando se ocorre o erro
        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'Susan Trê',
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should be able to update the password", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Atualizando o perfil do usuário
        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: '123456',
            password: '123123',
        });

        // Verificando se o usuário possui os novos dados
        expect(updatedUser.password).toBe('123123');
    });

    it("should be not able to update the password without providing the old password", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se ocorre o erro
        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should be not able to update the password providing a wrong old password", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Verificando se ocorre o erro
        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Trê',
            email: 'johntre@example.com',
            old_password: 'wrong-old-password',
            password: '123123',
        })).rejects.toBeInstanceOf(AppError);
    });
});
