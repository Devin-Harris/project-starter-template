import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const HomePageActions = createActionGroup({
  source: 'Home Page',
  events: {
    'Page Entered': emptyProps(),
  },
});

export const HomeApiActions = createActionGroup({
  source: 'Home Api',
  events: {
    'Get Ticket Counts': emptyProps(),
    'Get Ticket Counts Success': props<{
      openedTicketsCount: number;
      closedTicketsCount: number;
    }>(),
    'Get Ticket Counts Failure': props<{ error: any }>(),
  },
});
