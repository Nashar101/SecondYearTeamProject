import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistoryTwo } from '../history-two.model';
import { HistoryTwoService } from '../service/history-two.service';

@Injectable({ providedIn: 'root' })
export class HistoryTwoRoutingResolveService implements Resolve<IHistoryTwo | null> {
  constructor(protected service: HistoryTwoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistoryTwo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((historyTwo: HttpResponse<IHistoryTwo>) => {
          if (historyTwo.body) {
            return of(historyTwo.body);
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
