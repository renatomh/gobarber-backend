import { hash, compare } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

// Implementação da interface de hash usando o BCrypt
class BCryptHashProvider implements IHashProvider {
    // Função para gerar uma chave
    public async generateHash(payload: string): Promise<string> {
        return hash(payload, 9);
    }

    // Função para comparar um payload com uma chave
    public async compareHash(payload: string, hashed: string): Promise<boolean> {
        return compare(payload, hashed);
    }
}

export default BCryptHashProvider;
