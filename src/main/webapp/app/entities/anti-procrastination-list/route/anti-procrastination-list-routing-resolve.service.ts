import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAntiProcrastinationList } from '../anti-procrastination-list.model';
import { AntiProcrastinationListService } from '../service/anti-procrastination-list.service';

@Injectable({ providedIn: 'root' })
export class AntiProcrastinationListRoutingResolveService implements Resolve<IAntiProcrastinationList | null> {
  constructor(protected service: AntiProcrastinationListService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAntiProcrastinationList | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((antiProcrastinationList: HttpResponse<IAntiProcrastinationList>) => {
          if (antiProcrastinationList.body) {
            return of(antiProcrastinationList.body);
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
