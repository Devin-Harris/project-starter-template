import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as entities from './indices/entities-index';
import * as migrations from './indices/migrations-index';

export const ormConfig: TypeOrmModuleOptions = {
  synchronize: false,
  ssl: true,
  autoLoadEntities: true,
  migrationsRun: true,
  migrations: Object.values(migrations),
  cli: {
    migrationsDir: 'src/migrations',
  },
  entities: Object.values(entities)
} as TypeOrmModuleOptions;
