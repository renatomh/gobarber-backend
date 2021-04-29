import { Request, Response } from 'express';
// Necessária a importação desse "reflect-metadata" por algum motivo que eu não faço ideia de qual possa ser
import "reflect-metadata";
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

// Criando o controlador para os agendamentos
export default class ProvidersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;

        // Instanciando o serviço a partir da injeção de dependência
        const listProviders = container.resolve(ListProvidersService);

        const providers = await listProviders.execute({
            user_id,
        });

        // Retornando os dados serializados para evitar enviar informações como a senha do prestador
        return response.json(classToClass(providers));
    }
}
