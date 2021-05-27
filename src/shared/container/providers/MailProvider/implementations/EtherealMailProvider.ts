import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';

/* Tornando a classe passível de injeção de dependência para o provider do template de e-mail */
@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  /* Definindo as configurações para o provider */
  constructor(
    /* Injetando a dependência do tepmla de e-mails */
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    /* Criando uma conta de testes */
    const account = nodemailer.createTestAccount().then(account => {
      /* Definindo o transporter */
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      });

      this.client = transporter;
    });
  }

  /* Função para envio de e-mails */
  public async sendMail({
    to,
    from,
    subject,
    templateData
  }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      /* Remetente */
      from: {
        name: from?.name || 'Equipe GoBarber',
        address: from?.email || 'equipe@gobarber.com.br',
      },
      /* Destinatário */
      to: {
        name: to.name,
        address: to.email,
      },
      /* Assunto */
      subject,
      /* Conteúdo (em html) */
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
