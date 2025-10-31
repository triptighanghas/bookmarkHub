import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Bookmark } from '../bookmarks/bookmark.entity';
import { Vote } from '../votes/vote.entity';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432, 10'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'bookmarkhub',
  entities: [User, Bookmark, Vote],
  synchronize: false,     
};

export default ormConfig;
