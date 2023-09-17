import { HttpException } from '@nestjs/common';

export interface ErrorState {
  error: HttpException;
}
