// Testes unitários para a funcionalidade de agendamentos
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

// Criando a categoria de testes
describe('ListProviderAppointments', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        // Criando o serviço
        listProviderAppointments = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
            fakeCacheProvider
        );
    });

    // Teste para a disponibilidade diária de novos agendamentos de um fornecedor
    it('should be able to list the appointments on a specific day from provider', async () => {
        // Criando novos agendamentos
        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2021, 3, 16, 12).getTime();
        })

        // Ao criar uma nova data, o índice para o mês se inicia no 0, assim temos:
        // janeiro (0), fevereiro (1), março (2), etc.
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 14, 0, 0),
        });
        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 15, 0, 0),
        });

        // Obtendo os agendamentos para o período
        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider',
            year: 2021,
            month: 5,
            day: 20,
        })

        // Verificando se os agendamentos estão corretos
        expect(appointments).toEqual([appointment1, appointment2])
    })
});
