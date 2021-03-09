import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  // Obtendo os dados passados no corpo da requisição
  const { name, email, password } = request.body;

  // Definindo o serviço para criação do usuário
  const createUser = new CreateUserService();
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
});

// Temos de definir o nome do campo que conetrár o arquivo a ser caregado na requisição
usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    // Definindo o serviço para atualização de avatar
    const updateUserAvatar = new UpdateUserAvatarService();
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
  },
);
export default usersRouter;
