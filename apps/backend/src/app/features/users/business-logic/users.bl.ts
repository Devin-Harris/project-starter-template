import { EntityBusinessLogic } from '@backend/core/entity-business-logic-base.bl';
import { Injectable } from '@nestjs/common';
import { User } from '@shared';

@Injectable()
export class UserBusinessLogic extends EntityBusinessLogic<User> {}
