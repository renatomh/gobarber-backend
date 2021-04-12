import { uuid } from 'uuidv4';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

import Appointment from '../../infra/typeorm/entities/Appointment';

class AppointmentsRepository
    // Definindo que a classe deve implementar a interface criada (escopo de regras)
    implements IAppointmentsRepository {
    // Criando a lista de appointments
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = this.appointments.find(
            // Verificando se as datas são iguais
            appointment => isEqual(appointment.date, date),
        )

        return findAppointment;
    }

    // Método estendido para criar um dado e já salvar a informação
    public async create({ provider_id, date }: ICreateAppointmentDTO): Promise<Appointment> {
        // Criando o novo objeto de agendamento
        const appointment = new Appointment();

        // Atribuindo os dados ao agendamento
        Object.assign(appointment, { id: uuid(), date, provider_id });
        // Poderíamos fazer também da forma tradicional
        // appointment.id = uuid();
        // appointment.date = date;
        // appointment.provider_id = provider_id;

        this.appointments.push(appointment)

        return appointment;
    }
}

export default AppointmentsRepository;
