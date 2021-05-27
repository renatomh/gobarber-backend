/* Aqui centralizamos as injeções das dependências dos providers */

/* Inicializando os containers para os providers */
import './StorageProvider';
import './CacheProvider';
/* A importação do template de e-mails deve vir antes do driver */
import './MailTemplateProvider';
import './MailProvider';
