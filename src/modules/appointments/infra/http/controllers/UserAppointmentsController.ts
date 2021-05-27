import { Request, Response } from 'express';
/* Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser */
import "reflect-metadata";
import { container } from 'tsyringe';

import ListUserAppointmentsService from '@modules/appointments/services/ListUserAppointmentsService';

/* Criando o controlador para os agendamentos */
export default class UserAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    /* Instanciando o repositório a partir da injeção de dependência */
    const listUserAppointments = container.resolve(ListUserAppointmentsService);
    const appointments = await listUserAppointments.execute({ user_id });
    return response.json(appointments);
  }
}
