import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface Request {
  date: Date;
  provider_id: string;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    // Obtendo o repositório criado para os agendamentos
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    // Definindo o horário de início para o agendamento
    const appointmentDate = startOfHour(date);

    // Verificando se já há algum agendamento no horário selecionado. Caso haja, informamos o erro
    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked.');
    }

    // Se não houver nenhum agendamento, criamos um novo e salvamos no banco de dados
    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });
    await appointmentsRepository.save(appointment);

    // Retornando o agendamento criado
    return appointment;
  }
}

export default CreateAppointmentService;
