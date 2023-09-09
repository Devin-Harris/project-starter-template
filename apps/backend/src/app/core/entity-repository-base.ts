import { DataSource, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';

export class EntityRepository<E> extends Repository<E> {
  constructor(target: EntityTarget<E>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }

  getEntityPrimaryKeyColumn(): keyof E | null {
    const columns = this.manager.connection.entityMetadatas[0].columns;
    const primaryKeyColumn: ColumnMetadata | undefined = columns.find((c) => c.isPrimary);
    if (!primaryKeyColumn) {
      console.error('No primary column found for entity');
      return null;
    }
    return primaryKeyColumn.propertyName as keyof E;
  }
}
