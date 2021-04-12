import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  date: Date;
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

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    // Definindo o horário de início para o agendamento
    const appointmentDate = startOfHour(date);

    // Verificando se já há algum agendamento no horário selecionado. Caso haja, informamos o erro
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    // Se não houver nenhum agendamento, criamos um novo e salvamos no banco de dados
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    // Retornando o agendamento criado
    return appointment;
  }
}

export default CreateAppointmentService;
