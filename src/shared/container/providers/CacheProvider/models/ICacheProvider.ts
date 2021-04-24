// Interface para o provider de cache

export default interface ICacheProvider {
    // Definição dos métodos necessários para o cache
    save(key: string, value: any): Promise<void>;
    recover<T>(key: string): Promise<T | null>;
    invalidate(key: string): Promise<void>;
    invalidatePrefix(prefix: string): Promise<void>;
}
