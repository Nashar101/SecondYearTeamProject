import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITesting } from '../testing.model';
import { TestingService } from '../service/testing.service';

@Injectable({ providedIn: 'root' })
export class TestingRoutingResolveService implements Resolve<ITesting | null> {
  constructor(protected service: TestingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITesting | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((testing: HttpResponse<ITesting>) => {
          if (testing.body) {
            return of(testing.body);
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
