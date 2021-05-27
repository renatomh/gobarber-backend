/* Interface para o provider de envio de e-mails */
import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  /* Definição dos métodos necessários para o envio de e-mail */
  sendMail(data: ISendMailDTO): Promise<void>;
}
