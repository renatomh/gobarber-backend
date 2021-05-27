import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

/* Definindo o tipo da resposta como sendo uma lista (não pode ser feito com o 'interface') */
type IResponse = Array<{
  hour: number;
  available: boolean;
}>

/* Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos) */
@injectable()
class ListProviderDayAvailabilityService {
  /* Definindo o parâmetro e já criando a variável (disponível no TypeScript somente) */
  constructor(
    /* Fazendo a injeção de dependências (desnecessário em sistemas pequenos) */
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      provider_id,
      year,
      month,
      day,
    })

    /* Hora de iníco para os agendamentos no dia */
    const hourStart = 8;

    /* Criando uma lista com as horas do dia e as disponibilidades */
    const eachHourArray = Array.from(
      /* Quantidade de agendamentos para o dia */
      { length: 10 },
      (_, index) => index + hourStart,
    )

    /* Obtendo a data/hora atual */
    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      /* Verificando se há um agendamento no horário */
      const hasAppointmentInHour = appointments.find(appointment =>
        getHours(appointment.date) == hour,
      );

      /* Obtendo a data/hora deve ser comparado com o atual */
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        /** Invertemos a disponibilidade de acordo com a presença do agendamento ou não
         * e verificando se é posterior à data e horário atuais */
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
      }
    })

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
