// Testes unitários para a funcionalidade de disponibilidade de agendamentos
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

// Criando a categoria de testes
describe('ListProviderDayAvailability', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        // Criando o serviço
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository
        );
    });

    // Teste para a disponibilidade diária de novos agendamentos de um fornecedor
    it('should be able to list the day availability from provider', async () => {
        // Criando novos agendamentos
        // Ao criar uma nova data, o índice para o mês se inicia no 0, assim temos:
        // janeiro (0), fevereiro (1), março (2), etc.
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 14, 0, 0),
        });
        await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2021, 4, 20, 15, 0, 0),
        });

        // Alterando a função 'Date.now()' para simular que estamos em um horário diferente do atual
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            // Criando a nova data/horário
            return new Date(2021, 4, 20, 11).getTime();
        })

        // Obtendo as disponibilidades para o período
        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: 'provider',
            day: 20,
            year: 2021,
            month: 5,
        })

        // Verificando se as disponibilidaeds estão de acordo com os agendamentos criados
        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 11, available: false },
            { hour: 12, available: true },
            { hour: 13, available: true },
            { hour: 14, available: false },
            { hour: 15, available: false },
            { hour: 16, available: true },
        ]))
    })
});
