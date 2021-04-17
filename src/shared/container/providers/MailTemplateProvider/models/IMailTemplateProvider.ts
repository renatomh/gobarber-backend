// Interface para o provider de template de e-mails
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
    // Definição dos métodos necessários para o modelo
    parse(data: IParseMailTemplateDTO): Promise<string>;
}
