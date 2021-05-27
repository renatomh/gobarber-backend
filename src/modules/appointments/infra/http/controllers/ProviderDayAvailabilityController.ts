import { Request, Response } from 'express';
/* Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser */
import "reflect-metadata";
import { container } from 'tsyringe';

import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

/* Criando o controlador para a funcionalidade */
export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    /* Instanciando o serviço a partir da injeção de dependência */
    const sistProviderDayAvailability = container.resolve(
      ListProviderDayAvailabilityService
    );

    const availability = await sistProviderDayAvailability.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year)
    });

    return response.json(availability);
  }
}
