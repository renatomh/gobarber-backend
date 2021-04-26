import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

// Definindo o tipo da resposta como sendo uma lista (não pode ser feito com o 'interface')
type IResponse = Array<{
    day: number;
    available: boolean;
}>

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class ListProviderMonthAvailabilityService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) { }

    public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month,
        })

        // Criando uma lista com os dias do mês e as disponibilidades
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        )
        const availability = eachDayArray.map(day => {
            // Criando a data de comparação para ver se se trata de ma data que já passou
            const compareDate = new Date(year, month-1, day, 23, 59, 59);
            // Pegando todos os agendamentos de um dia específico
            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) == day;
            })

            // Agendamentos de 8h às 17h com duração de uma hora cada
            // Total, 10 agendamentos por dia
            return {
                day,
                available:
                    // Verificando também se a data ainda não passou
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            }
        })

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
