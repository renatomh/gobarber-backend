// Testes unitários para a funcionalidade de envio de e-mail para recuperação de senha
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

// Criando a categoria de testes
describe('SendForgotPasswordEmail', () => {
    // Chamando uma função antes da execução dos testes
    beforeEach(() => {
        // Instanciando o repositório fake
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeMailProvider = new FakeMailProvider();
        // Criando o serviço
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeMailProvider,
        );
    });

    // Teste para a funcionalidade
    it('should be able to recover the password using the email', async () => {
        // "Espionando" o provider para ver se a função é chamada
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        // Criando o novo usuário
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Utilizando o serviço
        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        // Verificando se a função 'sendMail' foi chamada
        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        // Verificando se ocorre uma rejeição
        await expect(sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        // "Espionando" o provider para ver se a função é chamada
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        // Criando o novo usuário
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456',
        });

        // Utilizando o serviço
        await sendForgotPasswordEmail.execute({
            email: 'johndoe@example.com',
        });

        // Verificando se a função foi chamada
        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
