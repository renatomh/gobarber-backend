import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import { classToClass } from 'class-transformer';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class ListProviderAppointmentsService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({
        provider_id,
        day,
        month,
        year
    }: IRequest): Promise<Appointment[]> {
        // Definindo a chave para o cache para os agendamentos de um provider específico em uma data específica
        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        // Primeiro verificamos se já há dados armazenados em cache
        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cacheKey
        );

        // Caso não haja dados em cache
        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id,
                year,
                month,
                day,
            });
            console.log('A query no banco foi feita!');
            // Salvando os dados pesquisados em cache
            await this.cacheProvider.save(
                cacheKey,
                // Salvando os dados de forma já serializada (tirando senha, incluindo URL do avatar) no cache
                classToClass(appointments)
            );
        }

        // Retornando os agendamentos do usuário
        return appointments;
    }
}

export default ListProviderAppointmentsService;
