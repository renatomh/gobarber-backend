import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UsersRepository
    // Definindo que a classe deve implementar a interface criada (escopo de regras)
    implements IUsersRepository {
    // Definindo o repositório ORM do tipo 'User'
    private ormRepository: Repository<User>

    constructor() {
        // Criando o repositório
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);
        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email }
        });
        return user;
    }

    // Método estendido para criar um dado e já salvar a informação
    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);
        await this.ormRepository.save(user);
        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

// const response = await findByDate(date);

export default UsersRepository;
