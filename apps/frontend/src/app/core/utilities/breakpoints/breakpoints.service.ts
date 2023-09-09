import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints } from './breakpoints';

@Injectable()
export class BreakpointsService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  screensizeChange(): Observable<Breakpoints | null> {
    return this.breakpointObserver
      .observe([...Object.values(Breakpoints)])
      .pipe(
        map((breakpointState) => {
          const matchingBreakpointValue = Object.keys(
            breakpointState.breakpoints
          ).find((bKey) => breakpointState.breakpoints[bKey] === true);
          const keys = [
            ...Object.keys(Breakpoints),
          ] as (keyof typeof Breakpoints)[];
          const matchingBreakpointKey = keys.find(
            (bKey) => Breakpoints[bKey] === matchingBreakpointValue
          );
          return matchingBreakpointKey
            ? Breakpoints[matchingBreakpointKey]
            : null;
        })
      );
  }
}
