export default {
  jwt: {
    // Acessando a variável ambiente do APP_SECRET
    // Deixamos a possibilidade de ficar um padrão para a execução dos testes
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '1d',
  },
};
