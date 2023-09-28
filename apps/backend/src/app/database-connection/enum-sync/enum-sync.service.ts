import { Injectable, Logger } from '@nestjs/common';
import * as Enums from '@shared/enums';
import {
  EnumClass,
  EnumObject,
} from 'libs/shared/src/enums/utilities/enum-utilities';
import { createFile } from 'tools/storage.helper';
import { syncMigrations } from 'tools/sync-scripts';
import { DataSource, QueryRunner, Table, TableColumnOptions } from 'typeorm';
import {
  EnumTableResponseRow,
  EnumTableSyncDeleteItem,
  EnumTableSyncInsertItem,
  EnumTableSyncItemType,
  EnumTableSyncType,
  EnumTableSyncUpdateItem,
} from './models/enum-sync.models';

@Injectable()
export class EnumSyncService {
  private queryRunner: QueryRunner;

  private itemsToSyncLog: EnumTableSyncItemType[] = [];

  constructor(private dataSource: DataSource) {
    this.queryRunner = dataSource.createQueryRunner();
  }

  async onModuleInit() {
    for (let key of Object.keys(Enums)) {
      const enumClass: EnumClass<EnumObject> = Enums[key];
      const rootTableName = enumClass.rootTableName;
      await this.buildTableIfNotExists(rootTableName);

      const enumIds = this.getEnumIdsFromEnumClass(enumClass);

      const itemsToUpdate = await this.getItemsToUpdate(rootTableName, enumIds);
      this.itemsToSyncLog.push(
        ...itemsToUpdate
          .filter(
            (i) =>
              enumClass.reversedObject[i.id].value !== i.value ||
              (enumClass.reversedObject[i.id].displayName ?? null) !==
                (i.displayName ?? null)
          )
          .map(
            (i): EnumTableSyncUpdateItem => ({
              rootTableName,
              newValue: enumClass.reversedObject[i.id].value,
              currentValue: i.value,
              newDisplayName: enumClass.reversedObject[i.id].displayName,
              currentDisplayName: i.displayName,
              id: i.id,
              type: 'update',
            })
          )
      );

      this.itemsToSyncLog.push(
        ...enumIds
          .filter((eId) => !itemsToUpdate.some((itu) => itu.id === eId))
          .map(
            (eId): EnumTableSyncInsertItem => ({
              rootTableName,
              newValue: enumClass.reversedObject[eId].value,
              newDisplayName: enumClass.reversedObject[eId].displayName,
              id: eId,
              type: 'insert',
            })
          )
      );

      const itemsToDelete = await this.getItemsToDelete(rootTableName, enumIds);
      this.itemsToSyncLog.push(
        ...itemsToDelete.map(
          (i): EnumTableSyncDeleteItem => ({
            rootTableName,
            currentValue: i.value,
            currentDisplayName: i.displayName,
            id: i.id,
            type: 'delete',
          })
        )
      );
    }

    this.logSyncStatus();
  }

  createEnumSyncMigration() {
    this.generateEnumSyncMigration();
    syncMigrations('');
  }

  generateEnumSyncMigration() {
    if (this.itemsToSyncLog.length > 0) {
      const timestamp = Date.now();
      const className = `EnumSync${timestamp}`;
      const fileName = `${timestamp}-EnumSync`;

      const migrationFileText = `
      import { MigrationInterface, QueryRunner, Table } from 'typeorm';

      export class ${className} implements MigrationInterface {
         public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(\`${this.enumSyncSql()}\`);
         }
      
         public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(\`${this.enumRevertSql()}\`);
         }
      }
    `;

      createFile(
        'apps/backend/src/app/migrations',
        `${fileName}.ts`,
        migrationFileText
      );

      return migrationFileText;
    }
  }

  private enumSyncSql() {
    let sql = '';
    this.itemsToSyncLog.forEach((i) => {
      if (i.type === 'update') {
        sql += `UPDATE ${i.rootTableName} SET value = '${i.newValue}', displayName = '${i.newDisplayName}' WHERE id = ${i.id};\n`;
      } else if (i.type === 'insert') {
        sql += `INSERT INTO ${i.rootTableName} (id, value, displayName) VALUES (${i.id}, '${i.newValue}', '${i.newDisplayName}');\n`;
      } else if (i.type === 'delete') {
        sql += `DELETE FROM ${i.rootTableName} WHERE id = ${i.id};\n`;
      }
    });
    return sql;
  }

  private enumRevertSql() {
    let sql = '';
    this.itemsToSyncLog.forEach((i) => {
      if (i.type === 'update') {
        sql += `UPDATE ${i.rootTableName} SET value = '${i.currentValue}', displayName = '${i.currentDisplayName}' WHERE id = ${i.id};\n`;
      } else if (i.type === 'insert') {
        sql += `DELETE FROM ${i.rootTableName} WHERE id = ${i.id};\n`;
      } else if (i.type === 'delete') {
        sql += `INSERT INTO ${i.rootTableName} (id, value, displayName) VALUES (${i.id}, '${i.currentValue}', '${i.currentDisplayName}');\n`;
      }
    });
    return sql;
  }

  logSyncStatus() {
    if (this.itemsToSyncLog.length > 0) {
      let currRootTableName = '';
      let syncLog =
        '\n\nConsider writing migrations for the following enum changes:\n\n';
      let type: EnumTableSyncType | null = null;
      this.itemsToSyncLog.forEach((i) => {
        if (currRootTableName !== i.rootTableName) {
          currRootTableName = i.rootTableName;
          syncLog += `${currRootTableName}\n`;
        }

        if (type !== i.type) {
          syncLog += `\t${i.type}:\n`;
          type = i.type;
        }

        if (i.type === 'update') {
          const newDisplayNameString = i.newDisplayName
            ? `(${i.newDisplayName})`
            : '';
          const currentDisplayNameString = i.currentDisplayName
            ? ` (${i.currentDisplayName}) `
            : '';
          syncLog += `\t\t${i.id}: from ${i.currentValue}${currentDisplayNameString}-> ${i.newValue} ${newDisplayNameString}\n`;
        } else if (i.type === 'insert') {
          const displayNameString = i.newDisplayName
            ? `(${i.newDisplayName})`
            : '';
          syncLog += `\t\t${i.id}: ${i.newValue} ${displayNameString}\n`;
        } else if (i.type === 'delete') {
          syncLog += `\t\t${i.id}: ${i.currentValue} (${i.currentDisplayName})\n`;
        }
      });
      syncLog += '\n';

      Logger.error('ENUMS are out of sync with the Database');
      Logger.warn(syncLog);
      return syncLog;
    }
  }

  private async buildTableIfNotExists(rootTableName: string) {
    const hasTable = await this.queryRunner.hasTable(rootTableName);
    if (!hasTable) {
      const columns: TableColumnOptions[] = [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isNullable: false,
          isGenerated: false,
        },
        {
          name: 'value',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'displayName',
          type: 'varchar',
          isNullable: false,
        },
      ];
      const table = new Table({ name: rootTableName, columns });
      await this.queryRunner.createTable(table);
    }
  }

  private async getItemsToUpdate(
    rootTableName: string,
    enumIds: number[]
  ): Promise<EnumTableResponseRow[]> {
    return await this.queryRunner.query(
      `SELECT * FROM ${rootTableName} e WHERE e.id IN (${Array.from(
        enumIds
      ).join(',')})`
    );
  }

  private async getItemsToDelete(
    rootTableName: string,
    enumIds: number[]
  ): Promise<EnumTableResponseRow[]> {
    return await this.queryRunner.query(
      `SELECT * FROM ${rootTableName} WHERE id NOT IN (${Array.from(
        enumIds
      ).join(',')})`
    );
  }

  private getEnumIdsFromEnumClass(enumClass: EnumClass<EnumObject>): number[] {
    return Object.keys(enumClass.reversedObject).map((idStr) => +idStr);
  }
}
