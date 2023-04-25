import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExtensionID } from '../extension-id.model';
import { ExtensionIDService } from '../service/extension-id.service';

@Injectable({ providedIn: 'root' })
export class ExtensionIDRoutingResolveService implements Resolve<IExtensionID | null> {
  constructor(protected service: ExtensionIDService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExtensionID | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((extensionID: HttpResponse<IExtensionID>) => {
          if (extensionID.body) {
            return of(extensionID.body);
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
