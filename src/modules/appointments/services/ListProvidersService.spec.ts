// Testes unitários para a funcionalidade de visualização de prestadores de serviço
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeCacheProvider: FakeCacheProvider;
let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

// Criando a categoria de testes
describe('ListProviders', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        // Criando o serviço
        listProvidersService = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider
        );
    });

    // Testes para a visualização de prestadores de serviço
    it("should be able to list the providers", async () => {
        // Criando os novos usuários
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });
        const user2 = await fakeUsersRepository.create({
            name: 'John Trê',
            email: 'johntre@example.com',
            password: '123456',
        });
        const loggedUser = await fakeUsersRepository.create({
            name: 'John Qua',
            email: 'johnqua@example.com',
            password: '123456',
        });

        // Exibindo o perfil dos usuários que não são o que está logado
        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        // Verificando se foram listados os usuários que não estão logados
        expect(providers).toEqual([user1, user2]);
    });
});
