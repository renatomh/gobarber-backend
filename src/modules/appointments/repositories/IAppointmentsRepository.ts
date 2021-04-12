import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';

// Interface para manter a estrutura das funções do repositório caso mudemos do TypeORM para outro ORM
export default interface IAppointmentsRepository {
    // Definindo os métodos que o repositório precisa ter
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
}
