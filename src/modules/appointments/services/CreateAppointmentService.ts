import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

interface IRequest {
  date: Date;
  user_id: string;
  provider_id: string;
}

/* Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos) */
@injectable()
class CreateAppointmentService {
  /* Definindo o parâmetro e já criando a variável (disponível no TypeScript somente) */
  constructor(
    /* Fazendo a injeção de dependências (desnecessário em sistemas pequenos) */
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) { }

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    /* Definindo o horário de início para o agendamento */
    const appointmentDate = startOfHour(date);

    /* Verificando se o horário escolhido para o agendamento está antes da data/hora atual */
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cannot create an appointment on a past date.');
    };

    /* Verificando se o usuário é também o prestador de serviços */
    if (user_id == provider_id) {
      throw new AppError('You cannot create an appointment with yourself.');
    };

    /* Verificando se o horário escolhido está dentro do horário comercial */
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You cannot create an appointment outside of business hours (8am to 5pm).');
    }

    /* Verificando se já há algum agendamento no horário selecionado. Caso haja, informamos o erro */
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    };

    /* Se não houver nenhum agendamento, criamos um novo e salvamos no banco de dados */
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    /* Pegando a data formatada (https://date-fns.org/v2.21.1/docs/format) */
    /* Precisamos escapar textos na formatação com aspas imples '' */
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");
    /* Criando a nova notificação a ser enviada aos usuários */

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    })

    /* Definindo a chave para o cache para os agendamentos de um provider específico em uma data específica */
    const cacheKey = `provider-appointments:${provider_id}:${format(
      appointmentDate,
      "yyyy-M-d"
    )}`;
    /* Invalidando o cache de agendamentos */
    await this.cacheProvider.invalidate(cacheKey);

    /* Retornando o agendamento criado */
    return appointment;
  }
}

export default CreateAppointmentService;
