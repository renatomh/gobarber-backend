import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
    '/forgot',
    // Validando os dados passados na requisição
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        }
    }),
    forgotPasswordController.create
);
passwordRouter.post(
    '/reset',
    // Validando os dados passados na requisição
    celebrate({
        [Segments.BODY]: {
            token: Joi.string().uuid().required(),
            password: Joi.string().required(),
            // Garantindo que as senhas são iguais
            password_confirmation: Joi.string().required().valid(Joi.ref('password')),
        }
    }),
    resetPasswordController.create
);

export default passwordRouter;
