import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository
    // Definindo que a classe deve implementar a interface criada (escopo de regras)
    implements IAppointmentsRepository {
    // Criando a lista de appointments
    private appointments: Appointment[] = [];

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(appointment =>
            // Verificando se as datas são iguais
            isEqual(appointment.date, date) &&
            // E se os IDs dos prestadores de serviço coincidem
            appointment.provider_id == provider_id,
        )

        return findAppointment;
    }

    public async findAllFromUser(user_id: string): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment =>
            // Verificando se os IDs são iguais
            appointment.user_id == user_id
        )

        return appointments;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment =>
            // Verificando se os IDs, meses e anos são iguais
            appointment.provider_id == provider_id &&
            getMonth(appointment.date) + 1 == month &&
            getYear(appointment.date) == year
        )

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        day,
        month,
        year
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const appointments = this.appointments.filter(appointment =>
            // Verificando se os IDs, dias, meses e anos são iguais
            appointment.provider_id == provider_id &&
            getDate(appointment.date) == day &&
            getMonth(appointment.date) + 1 == month &&
            getYear(appointment.date) == year
        )

        return appointments;
    }

    // Método estendido para criar um dado e já salvar a informação
    public async create({
        provider_id,
        user_id,
        date
    }: ICreateAppointmentDTO): Promise<Appointment> {
        // Criando o novo objeto de agendamento
        const appointment = new Appointment();

        // Atribuindo os dados ao agendamento
        Object.assign(appointment, { id: uuid(), date, provider_id, user_id });
        // Poderíamos fazer também da forma tradicional
        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;
        // appointment.user_id = user_id;

        this.appointments.push(appointment)

        return appointment;
    }
}

export default AppointmentsRepository;
