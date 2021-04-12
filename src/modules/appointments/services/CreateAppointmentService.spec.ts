// Testes unitários para a funcionalidade de criação de agendamentos
import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

// Criando a categoria de testes
describe('CreateAppointment', () => {
    // Teste para a criação de novos agendamentos (o 'it' é a mesma coisa do 'test')
    it('should be able to create a new appointment', async () => {
        // Instanciando o repositório fake
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        // Criando o serviço
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        // Criando o novo agendamento
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123'
        });

        // Verificando se o usuário possui a propriedade 'id'
        expect(appointment).toHaveProperty('id');
        // Verificando se o ID do provider está correto
        expect(appointment.provider_id).toBe('123123');
    })

    // Teste para verificar agendamentos numa mesma data e horário
    it('should not be able to create two appointments on the same time', async () => {
        // Instanciando o repositório fake
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        // Criando o serviço
        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        // Definindo uma data para os agendamentos de teste
        const appointmentDate = new Date(2021, 3, 10, 11);

        // Criando o novo agendamento
        const appointment = await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123'
        });

        // Testando para ver se a criação de um novo agendamento na mesma data resultará em erro
        expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123'
        })).rejects.toBeInstanceOf(AppError);
    })
});
