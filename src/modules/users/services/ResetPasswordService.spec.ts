/* Testes unitários para a funcionalidade de recuperação de senha */
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

/* Criando a categoria de testes */
describe('ResetPasswordService', () => {
  /* Chamando uma função antes da execução dos testes */
  beforeEach(() => {
    /* Instanciando o repositório fake */
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    /* Criando o serviço */
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  /* Teste para a funcionalidade */
  it('should be able to reset the password', async () => {
    /* Criando o novo usuário */
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    /* Criando o token */
    const { token } = await fakeUserTokensRepository.generate(user.id);

    /* "Espionando" o provider para ver se a função é chamada */
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    /* Utilizando o serviço */
    await resetPassword.execute({
      password: '123123',
      token,
    });

    /* Recuperando o usuário com a senha alterada */
    const updatedUser = await fakeUsersRepository.findById(user.id);

    /* Verificando se a função de criptografia foi chamada */
    expect(generateHash).toHaveBeenCalledWith('123123');
    /* Verificando se a senha foi alterada */
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    /* Verificando se a requisição será rejeitada */
    await expect(resetPassword.execute({
      token: 'non-existing-token',
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-existing user', async () => {
    /* Criando um token para um usuário que não existe */
    const { token } = await fakeUserTokensRepository.generate('non-eixsting-user');

    /* Verificando se a requisição será rejeitada */
    await expect(resetPassword.execute({
      token: token,
      password: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to reset the password after token expires', async () => {
    /* Criando o novo usuário */
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    /* Criando o token */
    const { token } = await fakeUserTokensRepository.generate(user.id);

    /* Alterando a função 'Date.now()' para simular que se passou o tempo de validade do token */
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      /* Criando a nova data */
      const customDate = new Date();
      /* Simulando que se passaram um número de horas */
      const expiresInHours = 3;
      return customDate.setHours(customDate.getHours() + expiresInHours);
    })

    /* Verificando se a requisição foi rejeitada */
    await expect(resetPassword.execute({
      password: '123123',
      token,
    })).rejects.toBeInstanceOf(AppError);
  });
});
