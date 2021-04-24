import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    // Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
    // index, show, create, update, delete
    async create(request: Request, response: Response): Promise<Response> {
        // Obtendo os dados passados no corpo da requisição
        const { email, password } = request.body;

        // Definindo o serviço para autenticação de usuário via injeção de dependência
        const authenticateUser = container.resolve(AuthenticateUserService);
        // Chamando a função do serviço (cada serviço só deve ter uma função)
        const { user, token } = await authenticateUser.execute({
            email,
            password,
        });

        // Retornando o objeto já alterado pelo 'class-transformer' do modelo de usuário
        // Removendo a senha e inserindo o avatar
        return response.json({ user: classToClass(user), token });
    }
}
