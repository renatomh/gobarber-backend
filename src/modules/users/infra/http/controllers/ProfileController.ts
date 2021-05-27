import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

export default class ProfileController {
  /** Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
   * index, show, create, update, delete */
  public async show(request: Request, response: Response): Promise<Response> {
    /* Obtendo os dados passados no corpo da requisição */
    const user_id = request.user.id;

    /* Definindo o serviço para exibição do usuário (via injeção de dependência) */
    const showProfile = container.resolve(ShowProfileService);

    /* Buscando e retornando o usuário */
    const user = await showProfile.execute({ user_id });

    /** Retornando o objeto já alterado pelo 'class-transformer' do modelo de usuário
     * Removendo a senha e inserindo o avatar */
    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    /* Obtendo os dados passados no corpo da requisição */
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    /* Definindo o serviço para criação do usuário (via injeção de dependência) */
    const updateProfile = container.resolve(UpdateProfileService);
    /* Chamando a função do serviço (cada serviço só deve ter uma função) */
    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password,
    });

    /** Retornando o objeto já alterado pelo 'class-transformer' do modelo de usuário
     * Removendo a senha e inserindo o avatar */
    return response.json(classToClass(user));
  }
}
