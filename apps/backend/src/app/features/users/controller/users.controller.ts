import { Controller, Inject } from '@nestjs/common';

import { EntityController } from '@backend/core/entity-controller-base.controller';
import { ResponseUserDto, User } from '@shared';

import { UserProvider } from '../provider/user.provider';

@Controller('users')
export class UsersController extends EntityController<User> {
  constructor(@Inject(UserProvider) provider: UserProvider) {
    super(provider, { responseEDto: ResponseUserDto });
  }
}
