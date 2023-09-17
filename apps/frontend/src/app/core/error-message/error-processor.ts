import { HttpException } from '@nestjs/common';

export function processErrorMessage(exception: HttpException): string {
  return exception.message ?? 'An unknown error occurred.';
}
