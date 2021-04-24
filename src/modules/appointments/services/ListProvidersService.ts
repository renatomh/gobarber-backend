import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users//infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class ListProvidersService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider,
    ) { }

    public async execute({ user_id }: IRequest): Promise<User[]> {
        // Primeiro verificamos se já há dados armazenados em cache
        let users = await this.cacheProvider.recover<User[]>(
            `providers-list:${user_id}`
        );

        // Caso não haja dados em cache
        if (!users) {
            users = await this.usersRepository.findAllProviders({
                except_user_id: user_id
            });
            //console.log('A query no banco foi feita!');
            // Salvando os dados pesquisados em cache
            await this.cacheProvider.save(`providers-list:${user_id}`, users);
        }

        // Retornando os usuários
        return users;
    }
}

export default ListProvidersService;
