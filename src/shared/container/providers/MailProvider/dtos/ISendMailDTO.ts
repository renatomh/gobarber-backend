// Definindo as informações a serem passadas no 'envio' de e-mails

import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

// Dados para o contato do e-mail
interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    // Destiinatário
    to: IMailContact;
    // Remetente (opcional)
    from?: IMailContact;
    // Assunto da mensagem
    subject: string;
    // Template para o conteúdo (corpo da mensagem)
    templateData: IParseMailTemplateDTO;
}
