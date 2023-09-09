import { EntityProvider } from '@backend/core/entity-provider-base.provider';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@shared';
import { UserBusinessLogic } from '../business-logic/users.bl';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserProvider extends EntityProvider<User> {
  constructor(
    @Inject(UserRepository)
    repository: UserRepository,
    @Inject(UserBusinessLogic)
    bl: UserBusinessLogic
  ) {
    super(repository, bl);
  }
}
