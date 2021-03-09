import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  // Obtendo os dados passados no corpo da requisição
  const { email, password } = request.body;

  // Definindo o serviço para autenticação de usuário
  const authenticateUser = new AuthenticateUserService();
  // Chamando a função do serviço (cada serviço só deve ter uma função)
  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  // Com a atualização do TypeScript, isso se faz necessário
  const userWithoutPassword = {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  return response.json({ user: userWithoutPassword, token });
});

export default sessionsRouter;
