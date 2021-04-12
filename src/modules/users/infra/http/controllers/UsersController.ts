import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
    // Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
    // index, show, create, update, delete
    async create(request: Request, response: Response): Promise<Response> {
        // Obtendo os dados passados no corpo da requisição
        const { name, email, password } = request.body;

        // Definindo o serviço para criação do usuário (via injeção de dependência)
        const createUser = container.resolve(CreateUserService);
        // Chamando a função do serviço (cada serviço só deve ter uma função)
        const user = await createUser.execute({
            name,
            email,
            password,
        });

        // Com a atualização do TypeScript, isso se faz necessário
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: null,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        return response.json(userWithoutPassword);
    }
}
