import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import uploadConfig from '@config/upload';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  /* Evitando que o campo seja enviado para o front-end */
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /* Incluindo o endereço para o avatar do usuário */
  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (!this.avatar) {
      /* É importante ter o arquivo padrão carregado */
      switch (uploadConfig.driver) {
        case 'disk':
          return `${process.env.APP_API_URL}/files/avatar-placeholder.jpg`;
        case 's3':
          return `https://${uploadConfig.config.aws.bucket}.s3.us-east-2.amazonaws.com/avatar-placeholder.jpg`;
        default:
          return null;
      }
    }
    /* Definindo a URL do arquivo de acordo com o driver de armazenamento sendo utilizado */
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.us-east-2.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
