import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../models/ICacheProvider';

export default class RedisCacheProvider implements ICacheProvider {
    // Declarando o cliente para o Redis
    private client: RedisClient;

    // Definindo as configurações para o provider
    constructor() {
        // Instanciando o cliente do Redis
        this.client = new Redis(cacheConfig.config.redis);
    }

    // Função para salvar dados
    public async save(key: string, value: any): Promise<void> {
        // Salvando o valor como uma string de objeto JSON
        this.client.set(key, JSON.stringify(value));
    }

    // Função para recuperar dados
    public async recover<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        // Caso não encontre nada, retorna vazio
        if (!data) return null;
        // Fazendo o parsing da string de objeto JSON armazenada para o tipo definido
        const parsedData = JSON.parse(data) as T;
        return parsedData;
    }

    // Função para invalidar dados a partir de uma chave
    public async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }

    // Função para invalidar dados a partir de um prefixo de chave
    public async invalidatePrefix(prefix: string): Promise<void> {
        // Buscando todas as chaves que iniciam com o prefixo definido
        const keys = await this.client.keys(`${prefix}:*`);
        // O pipeline permite realizar várias operações de uma vez de forma mais performática
        const pipeline = this.client.pipeline();
        // Para cada chave obtida, removemos do cache
        keys.forEach(key => {
            pipeline.del(key);
        });
        // Executando o pipeline criado
        await pipeline.exec();
    }
}
