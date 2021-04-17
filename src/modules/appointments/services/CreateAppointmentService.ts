import { startOfHour, isBefore, getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  date: Date;
  user_id: string;
  provider_id: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class CreateAppointmentService {
  // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
  constructor(
    // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    // Definindo o horário de início para o agendamento
    const appointmentDate = startOfHour(date);

    // Verificando se o horário escolhido para o agendamento está antes da data/hora atual
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cannot create an appointment on a past date.');
    };

    // Verificando se o usuário é também o prestador de serviços
    if (user_id == provider_id) {
      throw new AppError('You cannot create an appointment with yourself.');
    };

    // Verificando se o horário escolhido está dentro do horário comercial
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You cannot create an appointment outside of business hours (8am to 5pm).');
    }

    // Verificando se já há algum agendamento no horário selecionado. Caso haja, informamos o erro
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    };

    // Se não houver nenhum agendamento, criamos um novo e salvamos no banco de dados
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    // Retornando o agendamento criado
    return appointment;
  }
}

export default CreateAppointmentService;
