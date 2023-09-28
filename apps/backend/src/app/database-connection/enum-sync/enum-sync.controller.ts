import { Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';

import { EnumSyncService } from './enum-sync.service';

@Controller('enum-sync')
export class EnumSyncController {
  constructor(
    @Inject(EnumSyncService) private enumSyncService: EnumSyncService
  ) {}

  @Get('/generate-enum-migration')
  generateEnumSyncMigration() {
    return `<pre>${this.enumSyncService.generateEnumSyncMigration()}</pre>`;
  }

  @Post()
  createAndRunEnumSyncMigration() {
    this.enumSyncService.createEnumSyncMigration();
    return HttpStatus.OK;
  }

  @Get()
  getEnumSyncLog() {
    return `<pre>${this.enumSyncService.logSyncStatus()}</pre>`;
  }
}
