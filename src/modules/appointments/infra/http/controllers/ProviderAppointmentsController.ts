import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
// Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser
import "reflect-metadata";
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

// Criando o controlador para os agendamentos
export default class ProviderAppointmentsController {
    public async index(request: Request, response: Response): Promise<Response> {
        const provider_id = request.user.id;
        const { day, month, year } = request.body;

        // Instanciando o repositório a partir da injeção de dependência
        const listProviderAppointments = container.resolve(ListProviderAppointmentsService);
        const appointments = await listProviderAppointments.execute({
            provider_id,
            day,
            month,
            year
        });
        return response.json(appointments);
    }
}
