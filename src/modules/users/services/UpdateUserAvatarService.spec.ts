// Testes unitários para a funcionalidade de atualização de avatar
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

// Criando a categoria de testes
describe('UpdateUserAvatar', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        // Criando o serviço
        updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
    });

    // Testes para a atualização de avatar
    it("should be able to update a user's avatar", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Atualizando o avatar do usuário
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        // Verificando se o usuário possui o avatar
        expect(user.avatar).toBe('avatar.jpg');
    });

    it("should not be able to update a non existing user avatar", async () => {
        // Verificando se a atualização será rejeitada
        await expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg',
        })).rejects.toBeInstanceOf(AppError);
    });

    it("should delete old avatar when updating to a new one", async () => {
        // "Espionando" o provider para ver se a função é chamada
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Atualizando o avatar do usuário
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        // Atualizando novamente o avatar do usuário
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        // Verificando se a função foi chamada para remover o primeiro avatar
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        // Verificando se o usuário possui o novo avatar
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
