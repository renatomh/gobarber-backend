import { Request, Response } from 'express';
// Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser
import "reflect-metadata";
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

// Criando o controlador para a funcionalidade
export default class ProviderMonthAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {
        const { provider_id } = request.params;
        const { month, year } = request.body;

        // Instanciando o serviço a partir da injeção de dependência
        const sistProviderMonthAvailability = container.resolve(
            ListProviderMonthAvailabilityService
        );

        const availability = await sistProviderMonthAvailability.execute({
            provider_id,
            month,
            year,
        });

        return response.json(availability);
    }
}
