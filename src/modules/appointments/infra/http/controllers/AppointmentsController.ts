import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
// Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser
import "reflect-metadata";
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';

// Criando o controlador para os agendamentos
export default class AppointmentController {
    public async index(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        // Instanciando o repositório a partir da injeção de dependência
        const listUserAppointments = container.resolve(ListUserAppointmentsService);
        const appointments = await listUserAppointments.execute({ user_id });
        return response.json(appointments);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        // Instanciando o repositório a partir da injeção de dependência
        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id,
            user_id,
        });

        return response.json(appointment);
    }
}
