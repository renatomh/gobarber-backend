/* Interface para o provider de armazenamento */
export default interface IStorageProvider {
  /* Definição dos métodos de salvar e deletar arquivos */
  saveFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
