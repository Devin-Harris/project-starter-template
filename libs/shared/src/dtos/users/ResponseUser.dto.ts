import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../entities/users/user.entity';

export class ResponseUserDto implements Partial<User> {
  @Expose()
  userId: number;

  @Expose()
  createDate: Date;

  @IsNotEmpty()
  @IsString()
  @Expose()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @Expose()
  email: string;
}
