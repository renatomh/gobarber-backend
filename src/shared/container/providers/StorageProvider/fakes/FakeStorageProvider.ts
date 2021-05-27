/* Fake da interface/modelo de armazenamento usando o disco local */
import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.storage.push(file);

    /* Retornando o nome do arquivo */
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      storageFile => storageFile == file,
    );
    /* Removendo o item da lista */
    this.storage.splice(findIndex, 1);
  }
}

export default FakeStorageProvider;
