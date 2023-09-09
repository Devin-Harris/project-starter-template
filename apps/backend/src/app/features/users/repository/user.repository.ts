import { EntityRepository } from '@backend/core/entity-repository-base';
import { Injectable } from '@nestjs/common';
import { User } from '@shared';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends EntityRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
