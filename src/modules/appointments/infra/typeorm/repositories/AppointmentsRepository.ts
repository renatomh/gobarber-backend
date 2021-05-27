import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointment';

class AppointmentsRepository
  /* Definindo que a classe deve implementar a interface criada (escopo de regras) */
  implements IAppointmentsRepository {
  /* Definindo o repositório ORM do tipo 'Appointment' */
  private ormRepository: Repository<Appointment>

  constructor() {
    /* Criando o repositório */
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    return findAppointment;
  }

  public async findAllFromUser(user_id: string): Promise<Appointment[]> {
    const appointments = await this.ormRepository.find({
      where: {
        user_id,
      },
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    /* Formatando o mês para a consulta */
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        /* Definindo uma 'query SQL nativa' */
        /* Formatações no PostgreSQL: https://www.postgresql.org/docs/10/functions-formatting.html */
        date: Raw(datefieldName =>
          `to_char(${datefieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    /* Formatando o dia e mês para a consulta */
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        /* Definindo uma 'query SQL nativa' */
        /* Formatações no PostgreSQL: https://www.postgresql.org/docs/10/functions-formatting.html */
        date: Raw(datefieldName =>
          `to_char(${datefieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      /* Retornando ainda os dados do usuário */
      relations: ['user'],
    });

    return appointments;
  }

  /* Método estendido para criar um dado e já salvar a informação */
  public async create({ provider_id, user_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date
    });
    await this.ormRepository.save(appointment);
    return appointment;
  }
}

/* const response = await findByDate(date); */

export default AppointmentsRepository;
