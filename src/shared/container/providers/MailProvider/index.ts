// Aqui fazemos as injeções das dependências de pacotes externos nas interfaces da aplicação
import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

// Organizando os providers criados para a seleção da implementação a partir da seleção do driver
const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider),
};

// Aqui é necessáio criar uma instância devido ao 'constructor'
container.registerInstance<IMailProvider>(
    'MailProvider',
    // O 'container.resolve()' é feito no próprio mailProviders com base
    // no driver selecionado (./src/config/mail.ts), puxando das variáveis ambiente
    providers[mailConfig.driver]
);
