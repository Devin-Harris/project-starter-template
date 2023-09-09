import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LayoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Load Layouts': emptyProps(),
    'Load Layouts Success': props<{ data: { expandMenu: boolean } }>(),
    'Load Layouts Failure': props<{ error: any }>(),
    'Expand Layout': props<{ saveUserPreference: boolean }>(),
    'Expand Layout Success': emptyProps(),
    'Expand Layout Failure': props<{ error: any }>(),
    'Collapse Layout': props<{ saveUserPreference: boolean }>(),
    'Collapse Layout Success': emptyProps(),
    'Collapse Layout Failure': props<{ error: any }>(),
  },
});
