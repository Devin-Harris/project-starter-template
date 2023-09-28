import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnumSyncModule } from './enum-sync/enum-sync.module';
import { ormConfig } from './ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          ...ormConfig,
          type: configService.get('TYPEORM_TYPE'),
          host: configService.get('TYPEORM_HOST'),
          username: configService.get('TYPEORM_USERNAME'),
          password: configService.get('TYPEORM_PASS'),
          database: configService.get('TYPEORM_DB'),
          port: +configService.get('TYPEORM_PORT'),
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    EnumSyncModule,
  ],
  exports: [TypeOrmModule, EnumSyncModule],
})
export class DatabaseModule {}
