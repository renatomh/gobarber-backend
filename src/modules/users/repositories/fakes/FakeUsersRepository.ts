import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository
  /* Definindo que a classe deve implementar a interface criada (escopo de regras) */
  implements IUsersRepository {
  /* Criando a lista de users */
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id == id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email == email);
    return findUser;
  }

  public async findAllProviders({
    except_user_id
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { users } = this;
    if (except_user_id) {
      users = this.users.filter(user => user.id != except_user_id);
    }
    return users;
  }

  /* Método estendido para criar um dado e já salvar a informação */
  public async create(userData: ICreateUserDTO): Promise<User> {
    /* Inicializando o objeto de usuário */
    const user = new User();

    /* Atribuindo as informações ao objeto de usuário e inseridno na lista */
    Object.assign(user, { id: uuid() }, userData);
    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    /* Procurando o usuário na lista pelo índice */
    const findIndex = this.users.findIndex(findUser => findUser.id == user.id);
    /* Sobrescrevendo o usuário na lista */
    this.users[findIndex] = user;

    return user;
  }
}

/* const response = await findByDate(date); */

export default FakeUsersRepository;
