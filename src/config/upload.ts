import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

// Diretório para armazenamento temporário dos arquivos
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  // Definindo os diretórios para os arquivos temporários e para o local final
  tmpFolder: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      // Criando uma hash para evitar que dois arquivos com nomes iguais gerem conflitos
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
