import { Controller, Get, HttpStatus, Inject, Post } from '@nestjs/common';

import { EnumSyncService } from './enum-sync.service';

/**
 * ALL ROUTES ON THIS CONTROLLER ARE FOR DEVELOPMENT ONLY!!!
 * In non development environments this controller should not be accessible
 */
@Controller('enum-sync')
export class EnumSyncController {
  constructor(
    @Inject(EnumSyncService) private enumSyncService: EnumSyncService
  ) {}

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
