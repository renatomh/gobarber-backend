// Implementação da interface/modelo de armazenamento usando o Amazon S3
import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

class S3StorageProvider implements IStorageProvider {
    private client: S3;

    // Construtor para o provider
    constructor() {
        // Instanciando o cliente do AWS S3
        this.client = new aws.S3({
            region: 'us-east-2',
        });
    }

    public async saveFile(file: string): Promise<string> {
        // Pegando o caminho do arquivo original
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        // Lemos o conteúdo do arquivo
        const fileContent = await fs.promises.readFile(originalPath);
        // Pegando a formatação/tipo do arquivo
        const ContentType = mime.getType(originalPath);
        // Caso o arquivo não tenha sido encontrado
        if (!ContentType) {
            throw new Error('File not found');
        }

        // Realizando o upload do arquivo no Amazon S3
        await this.client
            .putObject({
                // Escolhendo o bucket criado para a aplicação
                Bucket: uploadConfig.config.aws.bucket,
                // Selecionando o nome do arquivo a ser caregado
                Key: file,
                // Definindo as permissões para o arquivo
                ACL: 'public-read',
                // Passando o conteúdo do arquivo
                Body: fileContent,
                // Definindo o tipo do arquivo
                ContentType,
            }).promise();

        // Apagando o arquivo local que foi carregado temporariamente
        await fs.promises.unlink(originalPath);

        // Retornando o nome do arquivo
        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client.deleteObject({
            // Escolhendo o bucket criado para a aplicação
            Bucket: uploadConfig.config.aws.bucket,
            // Selecionando o nome do arquivo a ser removido
            Key: file,
        }).promise();
    }
}

export default S3StorageProvider;
