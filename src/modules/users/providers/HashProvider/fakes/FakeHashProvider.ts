import IHashProvider from '../models/IHashProvider';

/* Implementação da interface de hash usando um fake */
class FakeHashProvider implements IHashProvider {
  /* Função para gerar uma chave */
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  /* Função para comparar um payload com uma chave */
  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return payload == hashed;
  }
}

export default FakeHashProvider;
