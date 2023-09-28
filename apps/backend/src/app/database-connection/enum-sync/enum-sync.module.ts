import { Global, Module } from '@nestjs/common';
import { EnumSyncController } from './enum-sync.controller';
import { EnumSyncService } from './enum-sync.service';

@Global()
@Module({
  imports: [],
  controllers: [EnumSyncController],
  providers: [EnumSyncService],
  exports: [EnumSyncService],
})
export class EnumSyncModule {}
