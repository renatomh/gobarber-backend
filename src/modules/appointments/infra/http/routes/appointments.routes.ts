import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';
import UserAppointmentsController from '../controllers/UserAppointmentsController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const userAppointmentsController = new UserAppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
    '/',
    // Validando os dados passados na requisição
    celebrate({
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date().required(),
        },
    }),
    appointmentsController.create
);
appointmentsRouter.get('/user', userAppointmentsController.index);
appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
