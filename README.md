# GoBarber - *Backend*

## 💡 Ideia do projeto

<br/>

Projeto desenvolvido durante o bootcamp *GoStack* da Rocketseat, com os módulos de *backend*.

<br/>

## 🔍 Funcionalidades

<br/>

## Recuperação de senha

**Requisitos Funcionais (RF)**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**Requisitos Não Funcionais (RNF)**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**Regras de Negócio (RN)**

- O link enviado por e-mail para resetar senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

## Atualização do perfil

**Requisitos Funcionais (RF)**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**Regras de Negócio (RN)**

- O usuário não pode alterar seu e-mail para um e-mail já utlizado;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o usuário deve confirmar a nova senha;

## Painel do prestador

**Requisitos Funcionais (RF)**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**Requisitos Não Funcionais (RNF)**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**Regras de Negócio (RN)**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

## Agendamento de serviços

**Requisitos Funcionais (RF)**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve poder realizar um novo agendamento com um prestador;

**Requisitos Não Funcionais (RNF)**

- A listagem de prestadores deve ser armazenada em cache;

**Regras de Negócio (RN)**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíveis entre 8h e 18h (primeiro às 8h, último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;

## 💹 Extras

- 
- 
- 
- 

<br/>

## 🛠 Tecnologias Utilizadas

<br/>

Para o desenvolvimento desse projeto, as seguintes tecnologias foram utilizadas:

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)

<br/>

## 💻 Configuração do Projeto

<br/>

### Primeiramente, clone o repositório para obter uma cópia do código em sua máquina local

```bash
$ git clone ... && cd ...
```

### Instale as dependências (comando para o yarn)

```bash
$ yarn
```

## 💾 Dependências

### **PostreSQL**

<br/>

Necessário ter um servidor PostgreSQL rodando. Pode ser utilizado o docker para 

```bash
$ docker ...
```

### **MongoDB**

<br/>

```bash
$ docker ...
```

### **Redis**

<br/>

```bash
$ docker ...
```

<br/>

## 🌐 Atualização dos arquivos de configuração

<br/>

É necessário também criar o arquivo *.env* na raiz do projeto, baseando-se no arquivo *.env.example* e atualizar os campos com as informações necessárias.

```
# Definindo o token secreto da aplicação
APP_SECRET=
# Definindo as URLs para a aplicação
APP_API_URL=http://localhost:3333
APP_WEB_URL=http://localhost:3000

# Definindo o driver de e-mail
MAIL_DRIVER=ethereal

# Chaves de acesso para o AWS
# Essas informações são lidas automaticamente pela SDK da AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# Definindo o driver de armazenamento
STORAGE_DRIVER=disk

# Definindo o driver de cache
CACHE_DRIVER=redis

# Credenciais do Redis (cache)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
```

Bem como o arquivo de configuração para o orm *ormconfig.json*, também na raiz do projeto, baseando-se no arquivo *ormconfig.example.json*, atualizando os campos com as informações apropriadas:

```json
[
  {
    "name": "default",
    "type": "postgres",
    "host": "[HOST]",
    "port": 5432,
    "username": "[USER_NAME]",
    "password": "[USER_PASSWORD]",
    "database": "gostack_gobarber",
    "entities": [
      "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "host": "[HOST]",
    "port": 27017,
    "database": "gobarber",
    "useUnifiedTopology": true,
    "entities": [
      "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]

```

## ⏯️ Executando o projeto

Para a execução do projeto em ambiente de desenvolvimento, basta executar o comando abaixo na pasta raiz do projeto:

```bash
$ yarn dev:server
```

<br />

## 🔨 *Build* do projeto para *Deploy*

Para a execução do projeto em ambiente de produção, deve-se realizar o *build* do projeto, como visto com o comando abaixo:

```bash
$ 
```

<br />

## 📄 Licença

Esse projeto está sob a licença ...
