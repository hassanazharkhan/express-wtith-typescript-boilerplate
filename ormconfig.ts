import { ConnectionOptions } from 'typeorm';
import config from './src/config';

export = {
  name: 'default',
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.name,
  synchronize: config.env === 'development',
  logging: false,
  entities: [
    'src/models/**/*.ts',
  ],
  migrations: [
    'src/migrations/**/*.ts',
  ],
  subscribers: [
    'src/subscribers/**/*.ts',
  ],
  cli: {
    migrationsDir: 'src/migrations',
  },
} as ConnectionOptions;
