import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAntiProcrastination } from '../anti-procrastination.model';
import { AntiProcrastinationService } from '../service/anti-procrastination.service';

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationRoutingResolveService implements Resolve<IAntiProcrastination | null> {
  constructor(protected service: AntiProcrastinationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAntiProcrastination | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((antiProcrastination: HttpResponse<IAntiProcrastination>) => {
          if (antiProcrastination.body) {
            return of(antiProcrastination.body);
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
