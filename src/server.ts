import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database';

// Definindo a utilização do express
const app = express();

// Permitindo a reazliação de requisições com dados formatados em json
app.use(express.json());
// Criando a rota para servir arquivos estáticos
app.use('/files', express.static(uploadConfig.directory))
// Definindo a utilização das rotas criadas (routes/index.ts)
app.use(routes);

// Criando a tratativa global de erros (deve estar após a utilização das rotas)
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  // Verificando se o erro é uma instância de AppError
  if (err instanceof AppError) {
    // Caso seja, trata-se de um erro criado pela aplicação
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  // Caso não seja um erro criado pela aplicação
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

// Iniciando o servidor na porta definida
app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
