import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared';
import { UserBusinessLogic } from './business-logic/users.bl';
import { UsersController } from './controller/users.controller';
import { UserProvider } from './provider/user.provider';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UserRepository, UserBusinessLogic, UserProvider],
  exports: [UserRepository, UserBusinessLogic, UserProvider],
})
export class UsersModule {}
