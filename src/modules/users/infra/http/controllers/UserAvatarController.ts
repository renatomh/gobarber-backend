import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
    // Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
    // index, show, create, update, delete
    async update(request: Request, response: Response): Promise<Response> {
        // Definindo o serviço para atualização de avatar (via injeção de dependância)
        const updateUserAvatar = container.resolve(UpdateUserAvatarService);
        // Chamando a função do serviço (cada serviço só deve ter uma função)
        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        // Removendo a senha do usuário para retornar a requisição
        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        return response.json(userWithoutPassword);
    }
}
