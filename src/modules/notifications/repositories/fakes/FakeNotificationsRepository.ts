import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../../infra/typeorm//schemas/Notification';

/* Definindo que a classe deve implementar a interface criada (escopo de regras) */
class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  /* Método estendido para criar um dado e já salvar a informação */
  public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification()
    Object.assign(notification, { id: new ObjectID(), content, recipient_id })
    this.notifications.push(notification);
    return notification;
  }
}

export default FakeNotificationsRepository;
