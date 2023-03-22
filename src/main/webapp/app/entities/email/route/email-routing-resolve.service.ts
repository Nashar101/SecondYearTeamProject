import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmail } from '../email.model';
import { EmailService } from '../service/email.service';

@Injectable({ providedIn: 'root' })
export class EmailRoutingResolveService implements Resolve<IEmail | null> {
  constructor(protected service: EmailService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmail | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((email: HttpResponse<IEmail>) => {
          if (email.body) {
            return of(email.body);
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
