import Appointment from '../infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

// Interface para manter a estrutura das funções do repositório caso mudemos do TypeORM para outro ORM
export default interface IAppointmentsRepository {
    // Definindo os métodos que o repositório precisa ter
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
    findAllFromUser(user_id: String): Promise<Appointment[]>;
    findAllInMonthFromProvider(
        data: IFindAllInMonthFromProviderDTO
    ): Promise<Appointment[]>;
    findAllInDayFromProvider(
        data: IFindAllInDayFromProviderDTO
    ): Promise<Appointment[]>;
}
