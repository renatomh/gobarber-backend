import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  /** Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
   * index, show, create, update, delete */
  async create(request: Request, response: Response): Promise<Response> {
    /* Obtendo os dados passados no corpo da requisição */
    const { password, token } = request.body;

    /* Definindo o serviço via injeção de dependência */
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      password,
      token
    });

    return response.status(204).json();
  }
}
