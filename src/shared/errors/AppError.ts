class AppError {
  /* Definindo a mensagem e o código do erro */
  public readonly message: string;
  public readonly statusCode: number;

  /* Definindo o construtor para o erro (código padrão é o 400) */
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
