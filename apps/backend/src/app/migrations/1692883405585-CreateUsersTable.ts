import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1692883405585 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table: Table = new Table({
      name: 'users',
      columns: [
        {
          name: 'userId',
          isPrimary: true,
          unsigned: true,
          isNullable: false,
          type: 'int',
          isGenerated: true,
        },
        { name: 'email', isNullable: false, type: 'varchar' },
        { name: 'lastname', isNullable: false, type: 'varchar' },
        { name: 'firstname', isNullable: false, type: 'varchar' },
        { name: 'password', isNullable: false, type: 'varchar' },
        {
          name: 'createDate',
          isNullable: false,
          type: 'datetime',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updateDate',
          isNullable: false,
          type: 'datetime',
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    });
    await queryRunner.createTable(table, true, true, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
