/* Testes unitários para a funcionalidade de visualização de agendamentos de um usuário */
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListUserAppointmentsService from './ListUserAppointmentsService';
import CreateAppointmentService from './CreateAppointmentService';

let fakeCacheProvider: FakeCacheProvider;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listUserAppointmentsService: ListUserAppointmentsService;
let createAppointment: CreateAppointmentService;

/* Criando a categoria de testes */
describe('ListUserAppointments', () => {
  /* Chamando uma função antes da execução dos testes */
  beforeEach(() => {
    /* Instanciando o repositório fake */
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    /* Criando o serviço */
    listUserAppointmentsService = new ListUserAppointmentsService(fakeAppointmentsRepository);
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  /* Testes para a visualização de agendamentos */
  it("should be able to list the appointments from a user", async () => {
    /* Simulando que estamos em um outro período */
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2021, 3, 16, 12).getTime();
    })

    /* Criando o novo agendamento */
    const appointment1 = await createAppointment.execute({
      date: new Date(2021, 3, 17, 13),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });
    const appointment2 = await createAppointment.execute({
      date: new Date(2021, 3, 17, 14),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });
    const appointment3 = await createAppointment.execute({
      date: new Date(2021, 3, 17, 15),
      user_id: 'user-id',
      provider_id: 'provider-id',
    });

    /* Exibindo os agendamentos do usuário */
    const appointments = await listUserAppointmentsService.execute({
      user_id: 'user-id',
    });

    /* Verificando se foram listados os agendamentos do usuário */
    expect(appointments).toEqual([appointment1, appointment2, appointment3]);
  });
});
