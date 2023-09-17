import { createErrorActionPayload } from '@frontend/core/error-message/models/error-message-actions';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LayoutActions = createActionGroup({
  source: 'Layout',
  events: {
    'Load Layouts': emptyProps(),
    'Load Layouts Success': props<{ data: { expandMenu: boolean } }>(),
    'Load Layouts Failure': createErrorActionPayload(),
    'Expand Layout': props<{ saveUserPreference: boolean }>(),
    'Expand Layout Success': emptyProps(),
    'Expand Layout Failure': createErrorActionPayload(),
    'Collapse Layout': props<{ saveUserPreference: boolean }>(),
    'Collapse Layout Success': emptyProps(),
    'Collapse Layout Failure': createErrorActionPayload(),
  },
});
