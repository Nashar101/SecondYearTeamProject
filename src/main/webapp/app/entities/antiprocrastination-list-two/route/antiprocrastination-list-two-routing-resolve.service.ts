import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAntiprocrastinationListTwo } from '../antiprocrastination-list-two.model';
import { AntiprocrastinationListTwoService } from '../service/antiprocrastination-list-two.service';

@Injectable({ providedIn: 'root' })
export class AntiprocrastinationListTwoRoutingResolveService implements Resolve<IAntiprocrastinationListTwo | null> {
  constructor(protected service: AntiprocrastinationListTwoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAntiprocrastinationListTwo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((antiprocrastinationListTwo: HttpResponse<IAntiprocrastinationListTwo>) => {
          if (antiprocrastinationListTwo.body) {
            return of(antiprocrastinationListTwo.body);
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
