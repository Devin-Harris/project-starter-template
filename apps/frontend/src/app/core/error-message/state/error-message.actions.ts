import { HttpException } from '@nestjs/common';
import { createActionGroup, props } from '@ngrx/store';

export const ErrorActions = createActionGroup({
  source: 'Error Message',
  events: {
    'Show Error': props<{ error: HttpException }>(),
    'Error Ignored': props<{
      error: HttpException;
      showAsErrorDialog?: boolean;
    }>(),
    'Error Message Error Occured': props<{
      error: HttpException;
      showAsErrorDialog?: boolean;
    }>(),
  },
});
