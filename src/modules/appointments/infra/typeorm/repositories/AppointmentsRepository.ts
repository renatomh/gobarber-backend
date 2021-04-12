import { getRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository
  // Definindo que a classe deve implementar a interface criada (escopo de regras)
  implements IAppointmentsRepository {
  // Definindo o repositório ORM do tipo 'Appointment'
  private ormRepository: Repository<Appointment>

  constructor() {
    // Criando o repositório
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  // Método estendido para criar um dado e já salvar a informação
  public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({provider_id, date});
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

// const response = await findByDate(date);

export default AppointmentsRepository;
