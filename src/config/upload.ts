import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

/* Diretório para armazenamento temporário dos arquivos */
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  /* Limitando as opções de driver de armazenamento */
  driver: 'disk' | 's3';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    }
  };
}

export default {
  /* Seleção do driver a ser utilizado */
  driver: process.env.STORAGE_DRIVER,

  /* Definindo os diretórios para os arquivos temporários e para o local final */
  tmpFolder: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        /* Criando uma hash para evitar que dois arquivos com nomes iguais gerem conflitos */
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;
        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    /* Definindo o bucket para o AWS S3 */
    aws: {
      bucket: 'app-gobarber-mhsw',
    },
  }
} as IUploadConfig;
