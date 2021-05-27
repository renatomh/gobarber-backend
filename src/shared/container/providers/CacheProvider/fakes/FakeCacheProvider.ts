import ICacheProvider from '../models/ICacheProvider';

/* Tipando o objeto para representar o armazenamento em cache */
interface ICacheData {
  [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  /* Inicializando um objeto para representar o armazenamento em cache */
  private cache: ICacheData = {};

  /* Função para salvar dados */
  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  /* Função para recuperar dados */
  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];
    /* Caso não encontre nada, retorna vazio */
    if (!data) return null;
    /* Fazendo o parsing da string de objeto JSON armazenada para o tipo definido */
    const parsedData = JSON.parse(data) as T;
    return parsedData;
  }

  /* Função para invalidar dados a partir de uma chave */
  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  /* Função para invalidar dados a partir de um prefixo de chave */
  public async invalidatePrefix(prefix: string): Promise<void> {
    /* Buscando todas as chaves que iniciam com o prefixo definido */
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`)
    );
    keys.forEach(key => {
      delete this.cache[key];
    })
  }
}
