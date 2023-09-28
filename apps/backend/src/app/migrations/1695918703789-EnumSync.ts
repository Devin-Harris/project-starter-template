
      import { MigrationInterface, QueryRunner, Table } from 'typeorm';

      export class EnumSync1695918703789 implements MigrationInterface {
         public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`INSERT INTO HousingTypes (id, value, displayName) VALUES (0, 'House', NULL);
INSERT INTO HousingTypes (id, value, displayName) VALUES (1, 'Dorm', NULL);
INSERT INTO HousingTypes (id, value, displayName) VALUES (2, 'Apartment', NULL);
INSERT INTO HousingTypes (id, value, displayName) VALUES (3, 'Apartment2', 'hi');
`);
         }
      
         public async down(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.query(`DELETE FROM HousingTypes WHERE id = 0;
DELETE FROM HousingTypes WHERE id = 1;
DELETE FROM HousingTypes WHERE id = 2;
DELETE FROM HousingTypes WHERE id = 3;
`);
         }
      }
    