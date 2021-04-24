import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import { injectable, inject } from 'tsyringe';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

// Tornando a classe passível de injeção de dependência para o provider do template de e-mail
@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;

    // Definindo as configurações para o provider
    constructor(
        // Injetando a dependência do tepmla de e-mails
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        // Documentação do nodemailer com o SES: https://nodemailer.com/transports/ses/
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: 'us-east-2',
            })
        })
    }

    // Função para envio de e-mails
    public async sendMail({
        to,
        from,
        subject,
        templateData
    }: ISendMailDTO): Promise<void> {
        // Pegando os dados padrão de remetente
        const { name, email } = mailConfig.defaults.from;

        await this.client.sendMail({
            // Remetente
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            // Destinatário
            to: {
                name: to.name,
                address: to.email,
            },
            // Assunto
            subject,
            // Conteúdo (em html)
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }
}
