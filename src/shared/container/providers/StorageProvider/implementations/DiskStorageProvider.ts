// Implementação da interface/modelo de armazenamento usando o disco local
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            // Movendo o arquivo do diretório temporário para a nova localidade
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, 'uploads', file),
        );

        // Retornando o nome do arquivo
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        // Verificando se o arquivo existe para removê-lo
        try { await fs.promises.stat(filePath); }
        // Caso o arquivo não tenha sido encontrado
        catch { return }

        // Caso o arquivo tenha sido encontrado, removemos o mesmo
        await fs.promises.unlink(filePath);
    }
}

export default DiskStorageProvider;
