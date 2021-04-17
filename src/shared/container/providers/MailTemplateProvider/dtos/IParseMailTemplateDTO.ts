// Definindo as informações a serem passadas no 'parse' do template de e-mails
interface ITemplateVariables {
    // Definindo que receberemos chaves como string e os valores como strings ou números
    [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    // Arquivo com o conteúdo base com o template
    file: string;
    // Variáveis para substituição no template
    variables: ITemplateVariables;
}
