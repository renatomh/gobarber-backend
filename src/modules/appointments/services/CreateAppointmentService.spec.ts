// Testes unitários para a funcionalidade de criação de agendamentos
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

// Criando a categoria de testes
describe('CreateAppointment', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeCacheProvider = new FakeCacheProvider();
        // Criando o serviço
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
            fakeCacheProvider
        );
    });

    // Teste para a criação de novos agendamentos (o 'it' é a mesma coisa do 'test')
    it('should be able to create a new appointment', async () => {
        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 3, 16, 12).getTime();
        })

        // Criando o novo agendamento
        const appointment = await createAppointment.execute({
            date: new Date(2021, 3, 16, 13),
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        // Verificando se o usuário possui a propriedade 'id'
        expect(appointment).toHaveProperty('id');
        // Verificando se o ID do provider está correto
        expect(appointment.provider_id).toBe('provider-id');
    });

    // Teste para verificar agendamentos numa mesma data e horário
    it('should not be able to create two appointments on the same time', async () => {
        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2021, 3, 16, 10).getTime();
        })

        // Definindo uma data para os agendamentos de teste
        const appointmentDate = new Date(2021, 3, 16, 11);

        // Criando o novo agendamento
        const appointment = await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        // Testando para ver se a criação de um novo agendamento na mesma data resultará em erro
        await expect(createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 3, 16, 12).getTime();
        })

        // Testando para ver se a criação de um novo agendamento numa data passada resultará em erro
        await expect(createAppointment.execute({
            date: new Date(2021, 3, 16, 11),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with smae user as provider', async () => {
        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 3, 16, 12).getTime();
        })

        // Testando para ver se a criação de um novo agendamento resultará em erro
        await expect(createAppointment.execute({
            date: new Date(2021, 3, 16, 13),
            user_id: 'user-id',
            provider_id: 'user-id',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment outside of business hours', async () => {
        // Horários comerciais definidos: 8h às 17h (último começando 17h e acabando 18h)

        // Simulando que estamos em um outro período
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 3, 16, 12).getTime();
        })

        // Testando para ver se a criação de um novo agendamento resultará em erro
        await expect(createAppointment.execute({
            date: new Date(2021, 3, 17, 7),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError);
        // Testando para ver se a criação de um novo agendamento resultará em erro
        await expect(createAppointment.execute({
            date: new Date(2021, 3, 17, 18),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError);
    });
});
