import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/Notification';

class NotificationsRepository
    // Definindo que a classe deve implementar a interface criada (escopo de regras)
    implements INotificationsRepository {
    // Definindo o tipo para o repositório
    private ormRepository: MongoRepository<Notification>

    constructor() {
        // Criando o repositório na conexão especificada no 'ormconfig.json'
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    // Método estendido para criar um dado e já salvar a informação
    public async create({ content, recipient_id }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            content,
            recipient_id,
        });
        await this.ormRepository.save(notification);
        return notification;
    }
}

export default NotificationsRepository;
