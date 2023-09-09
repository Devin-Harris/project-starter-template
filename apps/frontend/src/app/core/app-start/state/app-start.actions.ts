import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ApplicationStart = createActionGroup({
   source: 'App Start',
   events: {
      Initialized: emptyProps(),
      'Authentication Verification Success': props<{
         // TODO: utilize LoginResult interface
         loginResult: any;
      }>(),
      'Authentication Verification Failure': props<{ error: any }>(),
   },
});
