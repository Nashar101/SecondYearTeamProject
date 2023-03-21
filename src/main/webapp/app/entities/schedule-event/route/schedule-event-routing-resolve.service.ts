import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScheduleEvent } from '../schedule-event.model';
import { ScheduleEventService } from '../service/schedule-event.service';

@Injectable({ providedIn: 'root' })
export class ScheduleEventRoutingResolveService implements Resolve<IScheduleEvent | null> {
  constructor(protected service: ScheduleEventService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScheduleEvent | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((scheduleEvent: HttpResponse<IScheduleEvent>) => {
          if (scheduleEvent.body) {
            return of(scheduleEvent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
