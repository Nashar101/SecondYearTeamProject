import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAlarm } from '../alarm.model';
import { AlarmService } from '../service/alarm.service';

@Injectable({ providedIn: 'root' })
export class AlarmRoutingResolveService implements Resolve<IAlarm | null> {
  constructor(protected service: AlarmService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAlarm | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((alarm: HttpResponse<IAlarm>) => {
          if (alarm.body) {
            return of(alarm.body);
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
