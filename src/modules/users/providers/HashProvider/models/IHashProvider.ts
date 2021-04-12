// Interface para o modelo do provider de 'hashs'
export default interface IHashProvider {
    generateHash(payload: string): Promise<string>;
    compareHash(payload: string, hashed: string): Promise<boolean>;
}
