import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // Pegando o cabeçalho com o token de autorização
  const authHeader = request.headers.authorization;

  // Caso não tenha sido encontrado, informamos o erro
  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Aqui ignoramos o texto "Bearer " e pegamos somente o token
  const [, token] = authHeader.split(' ');

  try {
    // Decodificando e verificando o token enviado
    const decoded = verify(token, authConfig.jwt.secret);

    // Pegando o ID do usuário codificado no token e salvando na requisição
    // Aqui é necessário a alteração nos @types para o express, criando o objeto 'user' no Request
    const { sub } = decoded as ITokenPayload;
    request.user = {
      id: sub,
    };

    // Indo para o próximo middleware
    return next();
  } catch {
    throw new AppError('Invalid JWT token', 401);
  }
}
