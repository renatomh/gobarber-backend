import { injectable, inject } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
    email: string;
}

// Tornando a classe passível de injeção de dependências (desnecessário em sistemas pequenos)
@injectable()
class SendForgotPasswordEmailService {
    // Definindo o parâmetro e já criando a variável (disponível no TypeScript somente)
    constructor(
        // Fazendo a injeção de dependências (desnecessário em sistemas pequenos)
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('MailProvider')
        private mailProvider: IMailProvider,
    ) { }

    public async execute({ email }: IRequest): Promise<void> {
        // Verificando se o usuário existe
        const user = await this.usersRepository.findByEmail(email);

        // Apresentando um erro caso não exista
        if (!user) {
            throw new AppError('User does not exists.');
        }

        // Gerando o token para o usuário
        const { token } = await this.userTokensRepository.generate(user.id);

        // Definindo o caminho para o template do e-mail
        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs'
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
                }
            }
        });
    }
}

export default SendForgotPasswordEmailService;
