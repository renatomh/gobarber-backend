import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';

export default class ForgotPasswordController {
  /** Seguindo o conceito de APIs RESTful, os controllers devem possuir no máximo 5 métodos
   * index, show, create, update, delete */
  async create(request: Request, response: Response): Promise<Response> {
    /* Obtendo os dados passados no corpo da requisição */
    const { email } = request.body;

    /* Definindo o serviço via injeção de dependência */
    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
