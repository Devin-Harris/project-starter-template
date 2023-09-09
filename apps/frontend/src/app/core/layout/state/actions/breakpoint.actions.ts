import { Breakpoints } from '@frontend/core/utilities/breakpoints/breakpoints';
import { createActionGroup, props } from '@ngrx/store';

export const BreakpointActions = createActionGroup({
  source: 'Breakpoints',
  events: {
    Change: props<{ breakpoint: Breakpoints | null }>(),
  },
});
