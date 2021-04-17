import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

import User from '@modules/users//infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class ListUserAppointmentsService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) { }

    public async execute({ user_id }: IRequest): Promise<Appointment[]> {
        const appointments = await this.appointmentsRepository.findAllFromUser(user_id);
        // Retornando os agendamentos do usuário
        return appointments;
    }
}

export default ListUserAppointmentsService;
