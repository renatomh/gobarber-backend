// Testes unitários para a funcionalidade de visualização de perfil
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

// Criando a categoria de testes
describe('ShowProfile', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        // Criando o serviço
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    // Testes para a visualização do usuário
    it("should be able to show a user's profile", async () => {
        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Exibindo o perfil do usuário
        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        // Verificando se o usuário possui os dados
        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('johndoe@example.com');
    });

    it("should not be able to show the profile from non-existing user", async () => {
        // Verificando se ocorre o erro
        await expect(showProfileService.execute({
            user_id: 'non-existing-user-id',
        })).rejects.toBeInstanceOf(AppError);
    });
});
