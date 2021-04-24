import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

// Garantindo que somente usuários logados terão acesso a essas rotas
profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
    '/',
    // Validando os dados passados na requisição
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string(),
            // Caso a senha antiga tenha sido passada
            password: Joi.when('old_password', {
                is: Joi.exist(),
                // A nova deve ser informada
                then: Joi.required(),
            }),
            // Caso a senha nova tenha sido passada
            password_confirmation: Joi.when('password', {
                is: Joi.exist(),
                // A confirmação deve ser informada e igual
                then: Joi.valid(Joi.ref('password')).required(),
            }),
        }
    }),
    profileController.update
);

export default profileRouter;
