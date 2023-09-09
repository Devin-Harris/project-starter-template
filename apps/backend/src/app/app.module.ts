import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntityDtoMapper } from './core/entity-dto-mapper';
import { DatabaseModule } from './database-connection/database-connection.module';
import { FeaturesModule } from './features/features.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['apps/backend/src/envs/.env'],
      isGlobal: true,
    }),
    DatabaseModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService, EntityDtoMapper],
  exports: [EntityDtoMapper],
})
export class AppModule {}
